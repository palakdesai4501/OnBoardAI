import os
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
import contextlib
import io

# Add parent directory to path so backend can be imported as a module
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from backend.utils.logger import logger, setup_logger
from backend.config import settings
from backend.main import OnboardingCrew
from backend.utils.exceptions import (
    OnboardingError,
    KnowledgeBaseError,
    ConfigurationError,
    ProcessingError
)
from backend.utils.file_cleanup import cleanup_old_files

setup_logger()

app = FastAPI(title=settings.api_title, version=settings.api_version)

if not settings.debug:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class EmployeeProfile(BaseModel):
    name: str = Field(..., min_length=1, description="Employee name")
    role: str = Field(..., min_length=1, description="Employee role")
    department: str = Field(..., description="Department")
    location: str = Field(..., description="Location")
    work_arrangement: str = Field(..., description="Work arrangement: remote, hybrid, or in_office")
    employment_type: str = Field(..., description="Employment type: full_time or part_time")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")

class OnboardingResponse(BaseModel):
    success: bool
    message: str
    execution_time: float
    output_file: str
    package_content: Optional[str] = None

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    kb_exists = os.path.exists(settings.persist_directory)
    api_key_set = settings.openai_api_key is not None
    
    status = "healthy" if (kb_exists and api_key_set) else "degraded"
    
    return {
        "status": status,
        "knowledge_base": "ready" if kb_exists else "not_found",
        "api_key_configured": api_key_set,
        "version": settings.api_version
    }


@app.get("/api/metrics")
async def metrics():
    """Basic metrics endpoint"""
    try:
        deleted_files = cleanup_old_files()
        return {
            "files_cleaned": deleted_files,
            "retention_days": settings.file_retention_days
        }
    except Exception as e:
        logger.error(f"Error getting metrics: {e}", exc_info=True)
        return {"error": "Failed to retrieve metrics"}

@app.post("/api/onboard", response_model=OnboardingResponse)
async def onboard_employee(request: Request, profile: EmployeeProfile):
    """
    Submit employee profile and start onboarding process.
    Returns the generated onboarding package content.
    """
    logger.info(f"Onboarding request received for {profile.name}")
    
    if not os.path.exists(settings.persist_directory):
        logger.error("Knowledge base not found")
        raise HTTPException(
            status_code=400,
            detail="Knowledge base not found. Please run setup_pdfs.py first."
        )
    
    if not settings.openai_api_key:
        logger.error("OpenAI API key not configured")
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Please add OPENAI_API_KEY to .env file."
        )
    
    try:
        employee_profile = profile.dict()
        
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            onboarding_crew = OnboardingCrew(employee_profile)
            result = onboarding_crew.run()
        
        output_file_path = os.path.join(settings.outputs_directory, result['output_file'])
        package_content = None
        
        if os.path.exists(output_file_path):
            with open(output_file_path, 'r', encoding='utf-8') as f:
                package_content = f.read()
        
        logger.info(f"Onboarding package created successfully for {profile.name}")
        
        return OnboardingResponse(
            success=True,
            message=f"Onboarding package created successfully for {profile.name}",
            execution_time=result['execution_time'],
            output_file=result['output_file'],
            package_content=package_content
        )
        
    except OnboardingError as e:
        logger.error(f"Onboarding error: {e.message}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=e.message
        )
    except Exception as e:
        logger.error(f"Unexpected error during onboarding: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )

@app.get("/api/output/{filename}")
async def download_output(filename: str):
    """Download the generated onboarding package file"""
    if ".." in filename or "/" in filename or "\\" in filename:
        logger.warning(f"Invalid filename attempted: {filename}")
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    output_path = os.path.join(settings.outputs_directory, filename)
    
    if not os.path.exists(output_path):
        logger.warning(f"File not found: {filename}")
        raise HTTPException(status_code=404, detail="File not found")
    
    logger.info(f"File download requested: {filename}")
    
    return FileResponse(
        path=output_path,
        filename=filename,
        media_type="text/markdown"
    )


@app.exception_handler(OnboardingError)
async def onboarding_error_handler(request: Request, exc: OnboardingError):
    """Handle custom onboarding errors."""
    logger.error(f"Onboarding error: {exc.message}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": exc.error_code, "message": exc.message}
    )


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info(f"Starting {settings.api_title} v{settings.api_version}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"CORS origins: {settings.cors_origins_list}")
    
    os.makedirs(settings.outputs_directory, exist_ok=True)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
        log_config=None
    )

