import React, { useMemo } from 'react';
import { useNodes, useEdges, useViewport } from 'reactflow';
import { ProblemNodeData } from './CustomNodes';

const Leaf = ({ x, y, rotation, scale = 1 }: { x: number, y: number, rotation: number, scale?: number }) => (
  <path
    d="M 0 0 C 10 -10 20 -10 30 0 C 20 10 10 10 0 0"
    fill="url(#leaf-gradient)"
    transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}
    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
  />
);

export const TreeRenderer: React.FC = () => {
  const nodes = useNodes();
  const edges = useEdges();
  const { x, y, zoom } = useViewport();

  const treeData = useMemo(() => {
    const trunks = nodes.filter((n) => n.type === 'trunk');
    if (trunks.length === 0) return null;

    // Use the first trunk as the main anchor
    const mainTrunk = trunks[0];
    const tx = mainTrunk.position.x + 90;
    const ty = mainTrunk.position.y + 40;
    const trunkBase = ty + 150;
    const trunkCrown = ty - 80;

    const trunkPath = `M ${tx - 30} ${trunkBase} L ${tx - 15} ${trunkCrown} L ${tx + 15} ${trunkCrown} L ${tx + 30} ${trunkBase} Z`;

    const branchPaths: { path: string; width: number }[] = [];
    const rootPaths: { path: string; width: number }[] = [];
    const leafClusters: { x: number; y: number }[] = [];
    const labels: { x: number; y: number; label: string; type: string }[] = [];

    // Recursive path building
    const buildTreePaths = (currentNodeId: string, startX: number, startY: number, level: number = 0) => {
      // Find all edges where this node is the source
      const outgoingEdges = edges.filter(e => e.source === currentNodeId);
      
      outgoingEdges.forEach(edge => {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!targetNode) return;

        const targetPos = { x: targetNode.position.x + 90, y: targetNode.position.y + 40 };
        const midY = (startY + targetPos.y) / 2;
        const path = `M ${startX} ${startY} C ${startX} ${midY} ${targetPos.x} ${midY} ${targetPos.x} ${targetPos.y}`;
        
        const width = Math.max(2, 10 - level * 2);

        const data = targetNode.data as ProblemNodeData;

        if (targetNode.type === 'branch') {
          branchPaths.push({ path, width });
          leafClusters.push({ x: targetPos.x, y: targetPos.y });
          labels.push({ x: targetPos.x, y: targetPos.y, label: data.label, type: 'branch' });
        } else if (targetNode.type === 'root') {
          rootPaths.push({ path, width });
          labels.push({ x: targetPos.x, y: targetPos.y, label: data.label, type: 'root' });
        }

        // Recurse down the tree
        buildTreePaths(targetNode.id, targetPos.x, targetPos.y, level + 1);
      });
    };

    // Start building paths from the trunk
    buildTreePaths(mainTrunk.id, tx, trunkCrown, 1);
    
    const findRootChildren = (parentId: string, parentX: number, parentY: number, level: number = 1) => {
      // Find nodes that point TO the current parent (working backward for roots)
      const incomingEdges = edges.filter(e => e.target === parentId);
      incomingEdges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (!sourceNode || sourceNode.type !== 'root') return;

        const sourcePos = { x: sourceNode.position.x + 90, y: sourceNode.position.y + 40 };
        const midY = (parentY + sourcePos.y) / 2;
        const path = `M ${parentX} ${parentY} C ${parentX} ${midY} ${sourcePos.x} ${midY} ${sourcePos.x} ${sourcePos.y}`;
        
        const width = Math.max(2, 12 - level * 3);
        const data = sourceNode.data as ProblemNodeData;
        rootPaths.push({ path, width });
        labels.push({ x: sourcePos.x, y: sourcePos.y, label: data.label, type: 'root' });

        findRootChildren(sourceNode.id, sourcePos.x, sourcePos.y, level + 1);
      });
    };

    findRootChildren(mainTrunk.id, tx, trunkBase, 1);

    // Add main problem label
    const trunkData = mainTrunk.data as ProblemNodeData;
    labels.push({ x: tx, y: ty, label: trunkData.label, type: 'trunk' });

    return { tx, ty, trunkPath, branchPaths, rootPaths, leafClusters, labels };
  }, [nodes, edges]);

  if (!treeData) return null;

  return (
    <div className="tree-renderer-container" style={{ 
      position: 'absolute', 
      width: '100%', 
      height: '100%', 
      top: 0, 
      left: 0, 
      pointerEvents: 'none',
      zIndex: 5 
    }}>
      <svg 
        className="tree-renderer-svg" 
        style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          top: 0, 
          left: 0, 
          overflow: 'visible',
          transformOrigin: '0 0',
          transform: `translate(${x}px, ${y}px) scale(${zoom})`
        }}
      >
        <defs>
          <linearGradient id="trunk-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5d4037" />
            <stop offset="100%" stopColor="#3e2723" />
          </linearGradient>
          <linearGradient id="leaf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2ecc71" />
            <stop offset="100%" stopColor="#27ae60" />
          </linearGradient>
        </defs>

        {/* Roots */}
        {treeData.rootPaths.map((item, i) => (
          <path key={`root-${i}`} d={item.path} fill="none" stroke="#5d4037" strokeWidth={item.width} strokeLinecap="round" opacity="0.6"/>
        ))}

        {/* Trunk */}
        <path d={treeData.trunkPath} fill="url(#trunk-gradient)" stroke="#3e2723" strokeWidth="1" opacity="0.9" />

        {/* Branches */}
        {treeData.branchPaths.map((item, i) => (
          <path key={`branch-${i}`} d={item.path} fill="none" stroke="#5d4037" strokeWidth={item.width} strokeLinecap="round" />
        ))}

        {/* Leaf Clusters */}
        {treeData.leafClusters.map((cluster, i) => (
          <g key={`leaves-${i}`}>
            <Leaf x={cluster.x - 30} y={cluster.y - 15} rotation={-45} scale={1} />
            <Leaf x={cluster.x} y={cluster.y - 25} rotation={0} scale={1.2} />
            <Leaf x={cluster.x + 25} y={cluster.y - 12} rotation={45} scale={1} />
          </g>
        ))}

        {/* Labels */}
        {treeData.labels.map((item, i) => (
          <g key={`label-${i}`} style={{ pointerEvents: 'auto' }}>
             <rect 
              x={item.x - 70} 
              y={item.y - 15} 
              width="140" 
              height="30" 
              rx="15" 
              fill={item.type === 'trunk' ? 'rgba(0,0,0,0.7)' : 'rgba(15, 23, 42, 0.5)'} 
              stroke={item.type === 'trunk' ? 'var(--accent-primary)' : 'transparent'}
              strokeWidth="2"
            />
            <text 
              x={item.x} 
              y={item.y} 
              textAnchor="middle" 
              alignmentBaseline="middle" 
              fill="#fff" 
              style={{ fontSize: item.type === 'trunk' ? '13px' : '11px', fontWeight: 600 }}
            >
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
