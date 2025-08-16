import { useState } from 'react';
import html2canvas from 'html2canvas';

interface Html2CanvasOptions {
  useCORS: boolean;
  allowTaint: boolean;
  logging: boolean;
  foreignObjectRendering: boolean;
  imageTimeout: number;
  removeContainer: boolean;
  scale: number;
}

interface UseScreenshotReturn {
  isProcessing: boolean;
  handleScreenshot: (elementId: string, filename: string) => Promise<void>;
  handleClipboard: (elementId: string) => Promise<void>;
}

export const useScreenshot = (): UseScreenshotReturn => {
  const [isProcessing, setIsProcessing] = useState(false);

  const html2canvasOptions: Html2CanvasOptions = {
    useCORS: true,
    allowTaint: true,
    logging: false,
    foreignObjectRendering: false,
    imageTimeout: 15000,
    removeContainer: true,
    scale: 4
  };

  // Hide UI elements (buttons, borders) before taking screenshot
  const hideElements = (elementId: string) => {
    const buttons = document.querySelectorAll(`#${elementId} .screenshot-buttons, #${elementId} #screenshot-button, #${elementId} #clipboard-button`);
    const tables = document.querySelectorAll(`#${elementId} table`);
    const containers = document.querySelectorAll(`#${elementId} .p-4`);

    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });

    tables.forEach(table => {
      (table as HTMLElement).style.border = 'none';
      (table as HTMLElement).style.boxShadow = 'none';
    });

    containers.forEach(container => {
      (container as HTMLElement).style.backgroundColor = 'transparent';
    });
  };

  // Restore UI elements to original state after screenshot
  const restoreElements = (elementId: string) => {
    const buttons = document.querySelectorAll(`#${elementId} .screenshot-buttons, #${elementId} #screenshot-button, #${elementId} #clipboard-button`);
    const tables = document.querySelectorAll(`#${elementId} table`);
    const containers = document.querySelectorAll(`#${elementId} .p-4`);

    buttons.forEach(button => {
      (button as HTMLElement).style.display = '';
    });

    tables.forEach(table => {
      (table as HTMLElement).style.border = '';
      (table as HTMLElement).style.boxShadow = '';
    });

    containers.forEach(container => {
      (container as HTMLElement).style.backgroundColor = '';
    });
  };

  // Capture screenshot of specified element and download as PNG file
  const handleScreenshot = async (elementId: string, filename: string): Promise<void> => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      hideElements(elementId);

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      const canvas = await html2canvas(element, html2canvasOptions);
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL();
      link.click();
      
    } catch (error) {
      console.error('Screenshot failed:', error);
      // Could add toast notification here
    } finally {
      restoreElements(elementId);
      setIsProcessing(false);
    }
  };

  // Capture screenshot of specified element and copy to clipboard (with fallback to download)
  const handleClipboard = async (elementId: string): Promise<void> => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      hideElements(elementId);

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      const canvas = await html2canvas(element, html2canvasOptions);

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          try {
            // Check for clipboard support more thoroughly
            if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
              // Additional check for secure context (HTTPS requirement)
              if (window.isSecureContext || location.protocol === 'https:' ||
                location.hostname === 'localhost' || location.hostname === '127.0.0.1' ||
                location.hostname.startsWith('192.168.') || location.hostname.endsWith('.local')) {

                // Test clipboard permissions first
                const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
                if (permission.state === 'denied') {
                  throw new Error('Clipboard permission denied');
                }

                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ]);
                resolve();
                return;
              } else {
                throw new Error('Clipboard requires secure context (HTTPS)');
              }
            } else {
              throw new Error('Clipboard API not supported');
            }
          } catch (error) {
            console.error('Clipboard copy failed:', error);
            
            // Fallback: download the image instead
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `berechnungen-${elementId}.png`;
            link.href = dataUrl;
            link.click();

            // More specific error messages
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('secure context')) {
              alert('Clipboard requires HTTPS. Image has been downloaded instead.');
            } else if (errorMessage.includes('permission denied')) {
              alert('Clipboard permission denied. Image has been downloaded instead.\n\nTip: Allow clipboard access in browser settings or use the Download button.');
            } else if (errorMessage.includes('not supported')) {
              alert('Clipboard not supported on this browser/OS. Image has been downloaded instead.\n\nTip: Use the Download button for reliable saving.');
            } else {
              alert('Clipboard copy failed. Image has been downloaded instead.');
            }
            
            resolve(); // Don't reject on fallback
          }
        });
      });
      
    } catch (error) {
      console.error('Screenshot failed:', error);
      // Could add toast notification here
    } finally {
      restoreElements(elementId);
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleScreenshot,
    handleClipboard
  };
};