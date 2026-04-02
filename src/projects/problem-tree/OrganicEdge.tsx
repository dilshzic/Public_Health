import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

export const OrganicEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate a wavy path using a simple math function for a natural look
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  // Adding deterministic waviness based on the ID to ensure unique but stable paths
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const amplitude = 15 + (seed % 10);
  
  const wavyPath = `M ${sourceX} ${sourceY} Q ${midX + amplitude} ${midY + amplitude} ${targetX} ${targetY}`;

  return (
    <BaseEdge 
      id={id} 
      path={wavyPath} 
      markerEnd={markerEnd} 
      style={{ 
        ...style, 
        strokeWidth: 3, 
        stroke: 'rgba(255, 255, 255, 0.4)',
        strokeDasharray: '0', 
      }} 
    />
  );
};
