"""Custom exceptions for the application."""
from typing import Optional


class OnboardingError(Exception):
    """Base exception for onboarding-related errors."""
    def __init__(self, message: str, error_code: Optional[str] = None):
        self.message = message
        self.error_code = error_code or "ONBOARDING_ERROR"
        super().__init__(self.message)


class KnowledgeBaseError(OnboardingError):
    """Exception raised when knowledge base is not available."""
    def __init__(self, message: str = "Knowledge base not found"):
        super().__init__(message, "KNOWLEDGE_BASE_ERROR")


class ConfigurationError(OnboardingError):
    """Exception raised for configuration errors."""
    def __init__(self, message: str = "Configuration error"):
        super().__init__(message, "CONFIGURATION_ERROR")


class ValidationError(OnboardingError):
    """Exception raised for validation errors."""
    def __init__(self, message: str = "Validation error"):
        super().__init__(message, "VALIDATION_ERROR")


class ProcessingError(OnboardingError):
    """Exception raised during processing."""
    def __init__(self, message: str = "Processing error"):
        super().__init__(message, "PROCESSING_ERROR")

