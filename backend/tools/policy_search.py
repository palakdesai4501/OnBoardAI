from crewai.tools import BaseTool
from tools.pdf_knowledge_base import WorkdayPDFKnowledgeBase

_knowledge_base = None


def get_knowledge_base():
    """Get or create the knowledge base singleton."""
    global _knowledge_base
    if _knowledge_base is None:
        _knowledge_base = WorkdayPDFKnowledgeBase()
    return _knowledge_base

class PolicySearchTool(BaseTool):
    name: str = "Workday Policy Search Tool"
    description: str = (
        "Searches Workday's official HR policy documents using semantic search. "
        "Input should be natural language queries like 'vacation policy', "
        "'California labor law requirements', 'remote work guidelines', "
        "'benefits enrollment', 'code of conduct'. "
        "Returns relevant excerpts from official Workday policy documents."
    )
    
    def _run(self, query: str) -> str:
        """
        Search Workday policies using semantic search.
        Returns relevant policy excerpts.
        """
        try:
            kb = get_knowledge_base()
            results = kb.search(query, n_results=3)
            return results
        except Exception as e:
            return f"Error searching policies: {str(e)}"