from crewai import Agent
from langchain_openai import ChatOpenAI
from tools.policy_search import PolicySearchTool
from crewai_tools import FileWriterTool
from backend.config import settings
from backend.utils.logger import logger
from backend.utils.exceptions import ConfigurationError

def get_llm():
    if not settings.openai_api_key:
        raise ConfigurationError("OPENAI_API_KEY not found in environment variables. Please add it to your .env file.")
    
    logger.debug(f"Initializing LLM with model: {settings.openai_model}")
    
    llm = ChatOpenAI(
        api_key=settings.openai_api_key,
        model=settings.openai_model,
        temperature=settings.openai_temperature,
        max_tokens=settings.openai_max_tokens,
        timeout=settings.openai_timeout,
        max_retries=settings.openai_max_retries
    )
    
    return llm

policy_search_tool = PolicySearchTool()
file_writer_tool = FileWriterTool()

class OnboardingAgents:
    """Factory class for creating specialized onboarding agents"""
    
    @staticmethod
    def policy_researcher():
        """
        Agent specialized in finding and synthesizing relevant Workday policies.
        Uses semantic search across real Workday PDF documents.
        """
        return Agent(
            role='Senior Policy Research Specialist',
            goal=(
                'Search Workday official policy documents and find all relevant '
                'policies for new employees based on their role, department, '
                'location, and employment type. Ensure no compliance requirements '
                'are missed.'
            ),
            backstory=(
                'You are an expert at searching and interpreting Workday HR policies. '
                'You use semantic search to find relevant policy sections from official '
                'Workday documents including the Code of Conduct, benefits policies, '
                'and employee handbooks. You have encyclopedic knowledge of employment '
                'law and never miss location-specific requirements (like California labor law) '
                'or department-specific needs (like engineering security training). '
                'Your research is always grounded in actual Workday policy documents - '
                'you never make up policies or guess. You are meticulous about compliance '
                'and always flag regulatory requirements.'
            ),
            tools=[policy_search_tool],
            llm=get_llm(),
            verbose=False,
            allow_delegation=False,
            max_iter=1
        )
    
    @staticmethod
    def onboarding_writer():
        """
        Agent specialized in creating personalized, welcoming onboarding content.
        Expertise: Clear communication, personalization, actionable checklists.
        """
        return Agent(
            role='Employee Experience & Onboarding Content Creator',
            goal=(
                'Create a warm, personalized, and comprehensive onboarding package '
                'that makes new employees feel welcomed and sets them up for success. '
                'Transform dry policy information into actionable, friendly guidance.'
            ),
            backstory=(
                'You are a skilled onboarding specialist with expertise in employee experience design. '
                'You know that onboarding sets the tone for an employee\'s entire journey with Workday. '
                'You write in a warm, professional tone that makes complex policies understandable. '
                'You excel at creating structured checklists that reduce new hire anxiety. '
                'You balance being thorough with being concise - you respect people\'s time. '
                'You always include specific action items with clear owners and deadlines. '
                'You understand Workday\'s culture of integrity, innovation, and putting employees first.'
            ),
            tools=[file_writer_tool],
            llm=get_llm(),
            verbose=False,
            allow_delegation=False,
            max_iter=1
        )
    