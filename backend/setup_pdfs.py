import os
import shutil
from tools.pdf_knowledge_base import WorkdayPDFKnowledgeBase

def setup():
    """
    One-time setup script to process Workday PDFs.
    Run this after adding PDF files to data/pdfs/
    """
    print("="*60)
    print("WORKDAY PDF KNOWLEDGE BASE SETUP")
    print("="*60)
    
    # Create directories
    pdf_dir = "data/pdfs"
    os.makedirs(pdf_dir, exist_ok=True)
    
    # Check for PDFs
    pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith('.pdf')]
    
    if not pdf_files:
        print(f"\n⚠️  No PDF files found in {pdf_dir}")
        print("\nPlease add Workday PDF files:")
        print(f"  1. Copy Workday Code of Conduct PDF to {pdf_dir}/")
        print(f"  2. Add any other Workday policy PDFs")
        print(f"  3. Run this script again")
        return
    
    print(f"\n✅ Found {len(pdf_files)} PDF file(s):")
    for pdf in pdf_files:
        print(f"   - {pdf}")
    
    # Process PDFs
    print("\nProcessing PDFs and creating knowledge base...")
    kb = WorkdayPDFKnowledgeBase()
    kb.ingest_pdfs()
    
    print("\n" + "="*60)
    print("✅ SETUP COMPLETE!")
    print("="*60)
    print("\nYou can now run main.py to create onboarding packages.")
    print("The agents will use real Workday policy content!\n")

if __name__ == "__main__":
    setup()