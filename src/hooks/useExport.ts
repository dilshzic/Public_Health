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
      ];
      return !exclusionClasses.some((className) => node.classList?.contains(className));
    };

    const options = {
      backgroundColor: '#0f172a',
      filter: filter as any,
      quality: 0.95,
      pixelRatio: 2, // High resolution for professional quality
    };

    let dataUrl = '';
    try {
      if (format === 'png') {
        dataUrl = await toPng(element, options);
      } else if (format === 'jpeg') {
        dataUrl = await toJpeg(element, options);
      } else if (format === 'svg') {
        dataUrl = await toSvg(element, options);
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
