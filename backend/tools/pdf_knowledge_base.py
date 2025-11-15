import os
import time
from typing import List, Dict
import PyPDF2
import chromadb
from sentence_transformers import SentenceTransformer
from backend.config import settings
from backend.utils.logger import logger

class WorkdayPDFKnowledgeBase:
    """
    Processes Workday PDF documents using local embeddings (free, no API needed).
    Memory-optimized with incremental processing.
    """
    
    def __init__(self, pdf_directory: str = None, persist_directory: str = None):
        self.pdf_directory = pdf_directory or settings.pdf_directory
        self.persist_directory = persist_directory or settings.persist_directory
        
        logger.info("Loading local embedding model (free, no API needed)...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Model loaded successfully")
        
        self.client = chromadb.PersistentClient(
            path=self.persist_directory
        )
        
        self.collection = self.client.get_or_create_collection(
            name="workday_policies",
            metadata={"description": "Workday HR policies and documents"}
        )
        
    def get_embedding(self, text: str) -> List[float]:
        """Get embedding from local model."""
        embedding = self.embedding_model.encode(text, show_progress_bar=False, convert_to_numpy=True)
        return embedding.tolist()
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text content from a PDF file."""
        try:
            text = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                total_pages = len(pdf_reader.pages)
                logger.info(f"Extracting text from {total_pages} pages...")
                
                for page_num in range(total_pages):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text() + "\n\n"
                    
                logger.info(f"Extracted {len(text)} characters")
            return text
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path}: {str(e)}", exc_info=True)
            return ""
    
    def chunk_text_generator(self, text: str, chunk_size: int = 1000, overlap: int = 200):
        """Generator that yields chunks incrementally to avoid memory issues."""
        start = 0
        text_length = len(text)
        chunk_num = 0
        
        while start < text_length:
            end = min(start + chunk_size, text_length)
            
            if end < text_length:
                sentence_end = max(
                    text.rfind('.', start, end),
                    text.rfind('!', start, end),
                    text.rfind('?', start, end)
                )
                if sentence_end > start + chunk_size // 2:
                    end = sentence_end + 1
            
            chunk = text[start:end].strip()
            
            if chunk and len(chunk) > 50:
                yield chunk_num, chunk
                chunk_num += 1
            
            start = max(start + 1, end - overlap)
            
            if start >= text_length:
                break
    
    def ingest_pdfs(self):
        """Process PDFs using local embeddings (free, no API needed)."""
        if not os.path.exists(self.pdf_directory):
            os.makedirs(self.pdf_directory)
            logger.info(f"Created {self.pdf_directory}. Please add Workday PDF files there.")
            return
        
        pdf_files = [f for f in os.listdir(self.pdf_directory) if f.endswith('.pdf')]
        
        if not pdf_files:
            logger.warning(f"No PDF files found in {self.pdf_directory}")
            return
        
        logger.info(f"Found {len(pdf_files)} PDF files. Processing with local embeddings...")
        
        for pdf_file in pdf_files:
            pdf_path = os.path.join(self.pdf_directory, pdf_file)
            logger.info(f"Processing: {pdf_file}")
            
            text = self.extract_text_from_pdf(pdf_path)
            if not text.strip():
                logger.warning(f"No text extracted from {pdf_file}")
                continue
            
            logger.info("Generating embeddings locally...")
            
            batch_size = 5
            batch_documents = []
            batch_chunks_list = []
            batch_metadatas = []
            batch_ids = []
            chunk_count = 0
            
            for chunk_num, chunk in self.chunk_text_generator(text):
                try:
                    chunk_count += 1
                    
                    if chunk_count % 5 == 0:
                        logger.debug(f"Progress: {chunk_count} chunks processed...")
                    
                    batch_documents.append(chunk)
                    batch_chunks_list.append(chunk)
                    batch_metadatas.append({
                        "source": pdf_file,
                        "chunk_id": chunk_num,
                    })
                    batch_ids.append(f"{pdf_file}_chunk_{chunk_num}")
                    
                    if len(batch_documents) >= batch_size:
                        embeddings = self.embedding_model.encode(
                            batch_chunks_list,
                            show_progress_bar=False,
                            batch_size=2,
                            convert_to_numpy=True
                        ).tolist()
                        
                        self.collection.add(
                            documents=batch_documents,
                            embeddings=embeddings,
                            metadatas=batch_metadatas,
                            ids=batch_ids
                        )
                        
                        batch_documents = []
                        batch_chunks_list = []
                        batch_metadatas = []
                        batch_ids = []
                        
                        time.sleep(0.1)
                    
                except Exception as e:
                    logger.error(f"Error on chunk {chunk_num+1}: {str(e)}", exc_info=True)
                    batch_documents = []
                    batch_chunks_list = []
                    batch_metadatas = []
                    batch_ids = []
                    continue
            
            if batch_documents:
                embeddings = self.embedding_model.encode(
                    batch_chunks_list,
                    show_progress_bar=False,
                    batch_size=2,
                    convert_to_numpy=True
                ).tolist()
                
                self.collection.add(
                    documents=batch_documents,
                    embeddings=embeddings,
                    metadatas=batch_metadatas,
                    ids=batch_ids
                )
            
            logger.info(f"Processed {chunk_count} chunks from {pdf_file}")
        
        total = self.collection.count()
        logger.info(f"Successfully ingested {len(pdf_files)} PDFs with {total} chunks!")
        logger.info("Cost: $0.00 (using free local embeddings)")
    
    def search(self, query: str, n_results: int = 3) -> str:
        """Search using local embeddings."""
        query_embedding = self.get_embedding(query)
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        if not results['documents'][0]:
            return "No relevant policies found."
        
        formatted_results = f"Found {len(results['documents'][0])} relevant policy sections:\n\n"
        
        max_chars_per_result = 500
        for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0]), 1):
            truncated_doc = doc[:max_chars_per_result] + "..." if len(doc) > max_chars_per_result else doc
            formatted_results += f"{i}. **From: {metadata['source']}**\n"
            formatted_results += f"   {truncated_doc}\n\n"
        
        return formatted_results

def setup_knowledge_base():
    """Run this once to process PDFs."""
    kb = WorkdayPDFKnowledgeBase()
    kb.ingest_pdfs()

if __name__ == "__main__":
    setup_knowledge_base()