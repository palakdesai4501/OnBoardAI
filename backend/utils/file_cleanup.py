"""File cleanup utilities for managing output files."""
import os
import time
from pathlib import Path
from backend.utils.logger import logger
from backend.config import settings


def cleanup_old_files(directory: str = None, retention_days: int = None) -> int:
    """
    Remove files older than retention_days from the specified directory.
    
    Args:
        directory: Directory to clean (defaults to outputs directory)
        retention_days: Number of days to retain files (defaults to config value)
    
    Returns:
        Number of files deleted
    """
    if directory is None:
        directory = settings.outputs_directory
    
    if retention_days is None:
        retention_days = settings.file_retention_days
    
    if not os.path.exists(directory):
        logger.warning(f"Directory {directory} does not exist")
        return 0
    
    cutoff_time = time.time() - (retention_days * 24 * 60 * 60)
    deleted_count = 0
    
    try:
        for file_path in Path(directory).iterdir():
            if file_path.is_file():
                file_age = os.path.getmtime(file_path)
                if file_age < cutoff_time:
                    try:
                        os.remove(file_path)
                        deleted_count += 1
                        logger.info(f"Deleted old file: {file_path}")
                    except OSError as e:
                        logger.error(f"Error deleting file {file_path}: {e}")
    
    except Exception as e:
        logger.error(f"Error during file cleanup: {e}")
    
    if deleted_count > 0:
        logger.info(f"Cleaned up {deleted_count} old files from {directory}")
    
    return deleted_count

