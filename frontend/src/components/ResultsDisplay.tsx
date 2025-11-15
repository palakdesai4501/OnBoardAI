import { useEffect, useRef } from 'react';
import { downloadPackage } from '../services/api';

interface ResultsDisplayProps {
  packageContent: string;
  outputFile: string;
  employeeName: string;
  executionTime: number;
  onReset: () => void;
}

export default function ResultsDisplay({
  packageContent,
  outputFile,
  employeeName,
  executionTime,
  onReset
}: ResultsDisplayProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to top when results are displayed
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [packageContent]);

  const handleDownload = async () => {
    try {
      await downloadPackage(outputFile);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download package. Please try again.');
    }
  };

  const handlePreview = () => {
    // Create a new window with the package content as a text file
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      // Escape HTML special characters
      const escapeHtml = (text: string) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      const escapedContent = escapeHtml(packageContent);
      const escapedFilename = escapeHtml(outputFile);
      
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${escapedFilename} - Preview</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                padding: 20px;
                background-color: #f5f5f5;
                line-height: 1.6;
                max-width: 1200px;
                margin: 0 auto;
              }
              pre {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #ddd;
                overflow-x: auto;
                white-space: pre-wrap;
                word-wrap: break-word;
                font-size: 14px;
              }
              h1 {
                color: #022043;
                margin-bottom: 20px;
                font-size: 24px;
              }
            </style>
          </head>
          <body>
            <h1>${escapedFilename}</h1>
            <pre>${escapedContent}</pre>
          </body>
        </html>
      `);
      previewWindow.document.close();
    } else {
      alert('Please allow pop-ups to preview the README file.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-[#F5F7FA]" ref={contentRef}>
      {/* Success Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#022043]">Onboarding Package Ready</h2>
              <p className="text-sm text-[#4A5568]">
                Generated for <span className="font-semibold">{employeeName}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[#4A5568]">Execution Time</div>
            <div className="text-lg font-semibold text-[#1A1A1A]">{executionTime.toFixed(1)}s</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="flex-1 px-6 py-3 bg-[#022043] text-white rounded-lg font-semibold hover:bg-[#022043] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#022043] focus:ring-offset-2"
          >
             Download Package
          </button>
          <button
            onClick={handlePreview}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-semibold hover:bg-[#357ABD] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2"
          >
           Preview README
          </button>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-[#F5F7FA] text-[#4A5568] rounded-lg font-semibold hover:bg-[#E8EBF0] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5F7FA] focus:ring-offset-2"
          >
            Create Another
          </button>
        </div>
      </div>

      {/* Package Preview */}
      <div className="border-t border-[#F5F7FA] pt-6">
        <h3 className="text-lg font-semibold text-[#022043] mb-4">Package Preview</h3>
        <div className="prose max-w-none bg-[#F5F7FA] rounded-lg p-6 overflow-auto max-h-[600px] border border-[#F5F7FA]">
          <pre className="whitespace-pre-wrap font-mono text-sm text-[#1A1A1A] leading-relaxed">
            {packageContent}
          </pre>
        </div>
      </div>
    </div>
  );
}

