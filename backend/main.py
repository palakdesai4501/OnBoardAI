import os
import json
from datetime import datetime
from crewai import Crew, Process
from agents.onboarding_agents import OnboardingAgents
from tasks.onboarding_tasks import OnboardingTasks
from backend.config import settings
from backend.utils.logger import logger
from backend.utils.exceptions import KnowledgeBaseError, ProcessingError


class OnboardingCrew:
    """Main orchestrator for employee onboarding crew"""
    
    def __init__(self, employee_profile):
        self.employee_profile = employee_profile
        self.agents = self._create_agents()
        self.tasks = self._create_tasks()
    
    def _create_agents(self):
        """Initialize all specialized agents"""
        return {
            'researcher': OnboardingAgents.policy_researcher(),
            'writer': OnboardingAgents.onboarding_writer()
        }
    
    def _create_tasks(self):
        """Initialize all tasks with context passing"""
        research_task = OnboardingTasks.research_policies(
            agent=self.agents['researcher'],
            employee_profile=self.employee_profile
        )
        
        writing_task = OnboardingTasks.create_onboarding_package(
            agent=self.agents['writer'],
            employee_profile=self.employee_profile
        )
        writing_task.context = [research_task]
        
        return [research_task, writing_task]
    
    def run(self):
        """Execute the onboarding crew workflow"""
        os.makedirs(settings.outputs_directory, exist_ok=True)
        
        logger.info(f"Starting onboarding for {self.employee_profile.get('name', 'Unknown')}")
        
        crew = Crew(
            agents=[self.agents['researcher'], self.agents['writer']],
            tasks=self.tasks,
            process=Process.sequential,
            verbose=False,
            memory=False,
            cache=True,
            max_rpm=settings.openai_max_rpm,
            step_callback=None
        )
        
        start_time = datetime.now()
        
        try:
            result = crew.kickoff()
            end_time = datetime.now()
            execution_time = (end_time - start_time).total_seconds()
            
            output_file = f"{self.employee_profile['name'].replace(' ', '_')}_onboarding_package.md"
            
            logger.info(f"Onboarding completed in {execution_time:.2f}s for {self.employee_profile.get('name')}")
            
            return {
                'result': result,
                'execution_time': execution_time,
                'output_file': output_file
            }
            
        except Exception as e:
            logger.error(f"Error during onboarding: {str(e)}", exc_info=True)
            raise ProcessingError(f"Failed to create onboarding package: {str(e)}") from e

def main():
    """Main entry point - run onboarding for test employee"""
    
    logger.info("="*70)
    logger.info("🚀 OnBoard AI - Autonomous Employee Onboarding")
    logger.info("="*70)
    
    if not os.path.exists(settings.persist_directory):
        logger.warning("No knowledge base found!")
        logger.info("Please run setup first:")
        logger.info("  1. Add Workday PDF files to data/pdfs/")
        logger.info("  2. Run: python setup_pdfs.py")
        logger.info("  3. Then run this script again")
        return
    
    try:
        with open('data/employee_profiles.json', 'r') as f:
            employees = json.load(f)
    except FileNotFoundError:
        logger.error("data/employee_profiles.json not found!")
        logger.info("Please create this file with employee test data.")
        return
    
    logger.info("Available Test Employees:")
    for i, emp in enumerate(employees, 1):
        logger.info(f"  {i}. {emp['name']} - {emp['role']} ({emp['location']})")
    
    logger.info(f"Running for: {employees[0]['name']}")
    
    employee = employees[0]
    
    onboarding_crew = OnboardingCrew(employee)
    result = onboarding_crew.run()
    
    logger.info("="*70)
    logger.info("EXECUTION SUMMARY")
    logger.info("="*70)
    logger.info(f"Successfully created onboarding package for {employee['name']}")
    logger.info(f"Check the {settings.outputs_directory}/ folder for the complete onboarding package")

if __name__ == "__main__":
    main()