import React, { useMemo } from 'react';
import { useNodes, useViewport } from 'reactflow';
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
  const { x, y, zoom } = useViewport();

  const treeData = useMemo(() => {
    const trunks = nodes.filter((n) => n.type === 'trunk');
    const branches = nodes.filter((n) => n.type === 'branch');
    const roots = nodes.filter((n) => n.type === 'root');

    if (trunks.length === 0) return null;

    const mainTrunkNode = trunks[0];
    const tx = mainTrunkNode.position.x + 90; // Center X
    const ty = mainTrunkNode.position.y + 40; // Center Y

    // 1. Trunk Geometry (Tapered)
    const trunkBase = ty + 150;
    const trunkCrown = ty - 80;
    const trunkPath = `M ${tx - 30} ${trunkBase} L ${tx - 15} ${trunkCrown} L ${tx + 15} ${trunkCrown} L ${tx + 30} ${trunkBase} Z`;

    const branchPaths: string[] = [];
    const rootPaths: string[] = [];
    const leafClusters: { x: number; y: number }[] = [];
    const labels: { x: number; y: number; label: string; type: string }[] = [];

    // 2. Generate Branch Paths & Leaf Clusters
    branches.forEach((node) => {
      const data = node.data as ProblemNodeData;
      const bx = node.position.x + 90;
      const by = node.position.y + 40;
      
      const midY = (trunkCrown + by) / 2;
      const path = `M ${tx} ${trunkCrown} C ${tx} ${midY} ${bx} ${midY} ${bx} ${by}`;
      branchPaths.push(path);
      leafClusters.push({ x: bx, y: by });
      labels.push({ x: bx, y: by, label: data.label, type: 'branch' });
    });

    // 3. Generate Root Paths
    roots.forEach((node) => {
      const data = node.data as ProblemNodeData;
      const rx = node.position.x + 90;
      const ry = node.position.y + 40;
      
      const midY = (trunkBase + ry) / 2;
      const path = `M ${tx} ${trunkBase} C ${tx} ${midY} ${rx} ${midY} ${rx} ${ry}`;
      rootPaths.push(path);
      labels.push({ x: rx, y: ry, label: data.label, type: 'root' });
    });

    // Add main problem label
    const trunkData = mainTrunkNode.data as ProblemNodeData;
    labels.push({ x: tx, y: ty, label: trunkData.label, type: 'trunk' });

    return { tx, ty, trunkPath, branchPaths, rootPaths, leafClusters, labels };
  }, [nodes]);

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
          <filter id="label-glow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>

        {/* Roots */}
        {treeData.rootPaths.map((path, i) => (
          <path key={`root-${i}`} d={path} fill="none" stroke="#5d4037" strokeWidth="8" strokeLinecap="round" opacity="0.4"/>
        ))}

        {/* Trunk */}
        <path d={treeData.trunkPath} fill="url(#trunk-gradient)" stroke="#3e2723" strokeWidth="1" opacity="0.8" />

        {/* Branches */}
        {treeData.branchPaths.map((path, i) => (
          <path key={`branch-${i}`} d={path} fill="none" stroke="#5d4037" strokeWidth="10" strokeLinecap="round" />
        ))}

        {/* Leaf Clusters */}
        {treeData.leafClusters.map((cluster, i) => (
          <g key={`leaves-${i}`}>
            <Leaf x={cluster.x - 40} y={cluster.y - 20} rotation={-45} scale={1.2} />
            <Leaf x={cluster.x} y={cluster.y - 30} rotation={0} scale={1.4} />
            <Leaf x={cluster.x + 30} y={cluster.y - 15} rotation={45} scale={1.2} />
            <Leaf x={cluster.x - 20} y={cluster.y + 10} rotation={90} scale={1.1} />
            <Leaf x={cluster.x + 20} y={cluster.y + 15} rotation={135} scale={1} />
          </g>
        ))}

        {/* Labels - with better legibility */}
        {treeData.labels.map((item, i) => (
          <g key={`label-${i}`} style={{ pointerEvents: 'auto' }}>
             <rect 
              x={item.x - 80} 
              y={item.y - 15} 
              width="160" 
              height="30" 
              rx="15" 
              fill={item.type === 'trunk' ? 'rgba(0,0,0,0.6)' : 'rgba(15, 23, 42, 0.4)'} 
              stroke={item.type === 'trunk' ? 'var(--accent-color)' : 'transparent'}
              strokeWidth="1"
            />
            <text 
              x={item.x} 
              y={item.y} 
              textAnchor="middle" 
              alignmentBaseline="middle" 
              fill="#fff" 
              style={{ fontSize: item.type === 'trunk' ? '14px' : '12px', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
