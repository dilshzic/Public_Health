import { useCallback } from 'react';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { useReactFlow } from 'reactflow';

export const useExport = () => {
  const { getNodes } = useReactFlow();

  const exportImage = useCallback(async (format: 'png' | 'jpeg' | 'svg', filename: string = 'problem-tree') => {
    // Target the entire container to include TreeRenderer
    const element = document.getElementById('problem-tree-container');
    if (!element) {
      console.error('Target element #problem-tree-container not found');
      return;
    }

    // Filter out UI elements we don't want in the export
    const filter = (node: HTMLElement) => {
      const exclusionClasses = [
        'react-flow__controls',
        'react-flow__attribution',
        'react-flow__panel',
        'sidebar',
        'hub-header',
        'nav-group',
        'theme-toggle-btn'
      ];
      return !exclusionClasses.some((className) => node.classList?.contains(className));
    };

    const options = {
      backgroundColor: '#ffffff',
      filter: filter as any,
      quality: 1,
      pixelRatio: 3, // Ultra-high resolution
    };

    let dataUrl = '';
    try {
      // Temporarily force light theme for the capture
      const originalTheme = element.getAttribute('data-theme');
      element.setAttribute('data-theme', 'light');

      if (format === 'png') {
        dataUrl = await toPng(element, options);
      } else if (format === 'jpeg') {
        dataUrl = await toJpeg(element, options);
      } else if (format === 'svg') {
        dataUrl = await toSvg(element, options);
      }

      // Restore original theme
      if (originalTheme) {
        element.setAttribute('data-theme', originalTheme);
      } else {
        element.removeAttribute('data-theme');
      }

      if (!dataUrl || dataUrl.length < 100) {
        throw new Error('Generated Data URL is invalid or too short');
      }

      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(`Failed to export ${format}:`, error);
    }
  }, [getNodes]);

  return { exportImage };
};
