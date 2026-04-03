import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Target, ArrowUpRight, Zap } from 'lucide-react';

export type NodeType = 'trunk' | 'root' | 'branch';

export interface ProblemNodeData {
  label: string;
  type: NodeType;
  description?: string;
  isArtistic?: boolean;
}

export interface Project {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  isArtistic: boolean;
  updatedAt: number;
}

const BaseNode = ({ selected, children, className, isArtistic }: any) => {
  return (
    <div className={`custom-node ${className} ${selected ? 'selected' : ''} ${isArtistic ? 'artistic-hidden' : ''}`}>
      {!isArtistic && children}
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: isArtistic ? 'none' : 'auto' }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: isArtistic ? 'none' : 'auto' }} />
    </div>
  );
};

export const TrunkNode = memo(({ data, selected }: NodeProps<ProblemNodeData>) => {
  return (
    <BaseNode data={data} selected={selected} className="node-trunk" isArtistic={data.isArtistic}>
      <div className="node-icon" style={{ backgroundColor: 'var(--trunk-color)', color: '#000', borderRadius: '8px' }}>
        <Target size={20} />
      </div>
      <div>
        <div className="node-type-label">Core Problem</div>
        <div className="node-label">{data.label}</div>
      </div>
    </BaseNode>
  );
});

export const RootNode = memo(({ data, selected }: NodeProps<ProblemNodeData>) => {
  return (
    <BaseNode data={data} selected={selected} className="node-root" isArtistic={data.isArtistic}>
      <div className="node-icon" style={{ backgroundColor: 'var(--root-color)', color: '#000', borderRadius: '8px' }}>
        <Zap size={20} />
      </div>
      <div>
        <div className="node-type-label">Root Cause</div>
        <div className="node-label">{data.label}</div>
      </div>
    </BaseNode>
  );
});

export const BranchNode = memo(({ data, selected }: NodeProps<ProblemNodeData>) => {
  return (
    <BaseNode data={data} selected={selected} className="node-branch" isArtistic={data.isArtistic}>
      <div className="node-icon" style={{ backgroundColor: 'var(--branch-color)', color: '#000', borderRadius: '8px' }}>
        <ArrowUpRight size={20} />
      </div>
      <div>
        <div className="node-type-label">Consequence</div>
        <div className="node-label">{data.label}</div>
      </div>
    </BaseNode>
  );
});

export const nodeTypes = {
  trunk: TrunkNode,
  root: RootNode,
  branch: BranchNode,
};
