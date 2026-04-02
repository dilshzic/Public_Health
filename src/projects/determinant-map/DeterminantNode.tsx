import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useEdges } from 'reactflow';

export interface DeterminantNodeData {
  label: string;
  type: string;
  onChange?: (label: string) => void;
  categories?: { id: string; color: string }[];
}

const DeterminantNode = ({ id, data, selected }: NodeProps<DeterminantNodeData>) => {
  const [label, setLabel] = useState(data.label);
  const edges = useEdges();

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    if (data.onChange) {
      data.onChange(e.target.value);
    }
  };

  /**
   * DEFENSIVE HANDLE SHADOWING:
   * Counts how many connections are active on a side AND finds the highest index
   * requested by any edge (e.g. 'top-target-2'). This prevents 'invisible arrows'
   * by ensuring the node ALWAYS renders the handles an edge expects.
   */
  const getHandleCountForSide = (side: string) => {
    let maxRequestedIndex = -1;
    let totalConnections = 0;

    edges.forEach(edge => {
      const isSource = edge.source === id && edge.sourceHandle?.startsWith(side);
      const isTarget = edge.target === id && edge.targetHandle?.startsWith(side);
      
      if (isSource || isTarget) {
        totalConnections++;
        // Extract the index from handle IDs like 'top-source-1'
        const sIdx = parseInt(edge.sourceHandle?.split('-').pop() || '0');
        const tIdx = parseInt(edge.targetHandle?.split('-').pop() || '0');
        if (isSource) maxRequestedIndex = Math.max(maxRequestedIndex, sIdx);
        if (isTarget) maxRequestedIndex = Math.max(maxRequestedIndex, tIdx);
      }
    });

    // Shadowing: Render at least maxRequestedIndex + 1 slots, or at least 1 default slot
    return Math.max(1, totalConnections, maxRequestedIndex + 1);
  };

  const renderHandles = (position: Position, side: string) => {
    const numHandles = getHandleCountForSide(side);
    
    return Array.from({ length: numHandles }).map((_, i) => {
      // Dynamic equidistant balancing
      const percentage = ((i + 1) * 100) / (numHandles + 1);
      const isVertical = position === Position.Top || position === Position.Bottom;
      const baseStyle = isVertical ? { left: `${percentage}%` } : { top: `${percentage}%` };
      
      return (
        <React.Fragment key={`${side}-${i}`}>
          <Handle
            id={`${side}-target-${i}`}
            type="target"
            position={position}
            className="determinant-handle subtle-handle"
            style={{ ...baseStyle, zIndex: 10 }}
          />
          <Handle
            id={`${side}-source-${i}`}
            type="source"
            position={position}
            className="determinant-handle subtle-handle"
            style={{ ...baseStyle, zIndex: 11 }}
          />
        </React.Fragment>
      );
    });
  };

  const category = data.categories?.find(c => c.id === data.type);
  const customStyle = category ? {
    backgroundColor: `${category.color}15`,
    borderColor: category.color,
  } : {};

  return (
    <div 
      className={`determinant-node node-${data.type} ${selected ? 'selected' : ''}`}
      style={customStyle}
    >
      {renderHandles(Position.Top, 'top')}
      {renderHandles(Position.Left, 'left')}
      
      <span className="node-type-badge">{data.type}</span>
      <input
        className="node-label"
        value={label}
        onChange={handleLabelChange}
        spellCheck={false}
      />

      {renderHandles(Position.Bottom, 'bottom')}
      {renderHandles(Position.Right, 'right')}
    </div>
  );
};

export default DeterminantNode;
