from crewai import Task
from textwrap import dedent

class OnboardingTasks:
    """Factory class for creating onboarding workflow tasks"""
    
    @staticmethod
    def research_policies(agent, employee_profile):
        """
        Research all relevant Workday policies for this specific employee.
        Returns a comprehensive policy brief with compliance requirements.
        """
        location = employee_profile['location']
        department = employee_profile['department']
        work_arrangement = employee_profile['work_arrangement']
        
        search_queries = []
        
        universal_query = "Code of Conduct, information security, data privacy, workplace safety, benefits enrollment, vacation policy, compliance requirements"
        search_queries.append(universal_query)
        
        specific_query_parts = []
        if 'California' in location or 'CA' in location:
            specific_query_parts.append("California labor law, meal breaks, home office stipend")
        elif 'Texas' in location or 'TX' in location:
            specific_query_parts.append("Texas hybrid work requirements")
        elif 'New York' in location or 'NY' in location:
            specific_query_parts.append("New York commuter benefits, co-working spaces")
        
        if 'Engineering' in department:
            specific_query_parts.append("Engineering GitHub access, security training, 2FA requirements")
        elif 'Sales' in department:
            specific_query_parts.append("Sales CRM access, customer data handling")
        elif 'HR' in department:
            specific_query_parts.append("HR privacy training, background checks")
        
        if specific_query_parts:
            search_queries.append(", ".join(specific_query_parts))
        
        queries_text = "\n".join([f"- {q}" for q in search_queries[:2]])
        
        return Task(
            description=dedent(f"""
                Research Workday policies for {employee_profile['name']} ({employee_profile['role']}, 
                {employee_profile['department']}, {employee_profile['location']}).
                
                **Make 1-2 searches maximum:**
                {queries_text}
                
                **Output:** Brief policy summary with:
                - Universal policies (Code of Conduct, security, privacy)
                - Location/department-specific requirements
                - Benefits enrollment 30-day deadline
                - System access requirements
            """),
            expected_output=dedent("""
                Brief policy summary (keep concise):
                - Universal policies
                - Location/department-specific requirements
                - Benefits enrollment 30-day deadline
                - System access requirements
            """),
            agent=agent,
            async_execution=False
        )
    
    @staticmethod
    def create_onboarding_package(agent, employee_profile):
        """
        Task 2: Create personalized onboarding materials from research.
        Output: Welcome email, checklists, policy summaries.
        """
        return Task(
            description=dedent(f"""
                Create onboarding package for {employee_profile['name']} ({employee_profile['role']}, 
                {employee_profile['department']}, {employee_profile['location']}, starts {employee_profile['start_date']}).
                
                **Sections:**
                1. Welcome Email - Personalized greeting, Day 1 schedule, key contacts
                2. Day 1 Checklist - Hour-by-hour schedule (9 AM IT, 10 AM HR, 11 AM training, 12 PM lunch, etc.)
                3. Week 1 Checklist - Training, system access, I-9, direct deposit
                4. 30-Day Checklist - **BENEFITS ENROLLMENT DEADLINE (Day 30)**, compliance training
                5. Policy Summaries - Vacation/PTO, benefits (30-day deadline!), Code of Conduct, location/department policies
                
                **Tone:** Warm, professional, actionable. Emphasize benefits enrollment 30-day deadline.
                
                Save to: outputs/{employee_profile['name'].replace(' ', '_')}_onboarding_package.md
            """),
            expected_output=dedent(f"""
                Onboarding package with welcome email, Day 1/week 1/30-day checklists, and policy summaries.
                Saved to: outputs/{employee_profile['name'].replace(' ', '_')}_onboarding_package.md
            """),
            agent=agent,
            context=[],
            async_execution=False
        )
    