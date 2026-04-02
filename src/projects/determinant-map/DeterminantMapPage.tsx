import { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MarkerType,
  OnSelectionChangeParams,
  updateEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng, toJpeg, toSvg } from 'html-to-image';

import DeterminantNode from './DeterminantNode';
import Sidebar from './Sidebar';

const nodeTypes = {
  determinant: DeterminantNode,
};

const defaultCategories = [
  { id: 'individual', label: 'Individual Factors', color: '#94a3b8' },
  { id: 'lifestyle', label: 'Lifestyle/Behavioral', icon: 'Activity', color: '#22c55e' },
  { id: 'social', label: 'Social Networks', icon: 'Users', color: '#eab308' },
  { id: 'working', label: 'Living/Working', icon: 'Briefcase', color: '#f97316' },
  { id: 'structural', label: 'Structural/Global', icon: 'Globe', color: '#a855f7' },
  { id: 'outcome', label: 'Health Outcome', icon: 'Heart', color: '#f43f5e' },
];

export interface DeterminantProject {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  updatedAt: number;
}

const STORAGE_KEYS = {
  NODES: 'determinant-map-nodes',
  EDGES: 'determinant-map-edges',
  CATEGORIES: 'determinant-map-categories',
  PROJECTS: 'determinant-map-projects',
  CURRENT: 'determinant-map-current-project'
};

const DeterminantMapPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<DeterminantProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [nodeCount, setNodeCount] = useState(0);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const lastId = localStorage.getItem(STORAGE_KEYS.CURRENT);
    
    let loadedProjects: DeterminantProject[] = [];
    
    if (savedProjects) {
      loadedProjects = JSON.parse(savedProjects);
    } else {
      // Migration logic from old format
      const oldNodes = localStorage.getItem(STORAGE_KEYS.NODES);
      if (oldNodes) {
        const oldEdges = localStorage.getItem(STORAGE_KEYS.EDGES);
        
        loadedProjects = [{
          id: 'default',
          name: 'Default Determinant Map',
          nodes: JSON.parse(oldNodes),
          edges: oldEdges ? JSON.parse(oldEdges) : [],
          updatedAt: Date.now()
        }];
      } else {
        // Fresh start
        loadedProjects = [{
          id: 'default',
          name: 'My Health Determinants',
          nodes: [
            { id: '1', type: 'determinant', data: { label: 'Age/Sex/Genetics', type: 'individual' }, position: { x: 400, y: 400 } },
            { id: '2', type: 'determinant', data: { label: 'Social Networks', type: 'social' }, position: { x: 400, y: 200 } }
          ],
          edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'top-source-0', targetHandle: 'bottom-target-0', className: 'edge-positive', markerEnd: { type: MarkerType.ArrowClosed } }
          ],
          updatedAt: Date.now()
        }];
      }
    }
    
    setProjects(loadedProjects);
    const initialId = lastId && loadedProjects.find(p => p.id === lastId) ? lastId : loadedProjects[0].id;
    setCurrentProjectId(initialId);
    
    // Global Categories load
    const savedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    } else {
      setCategories(defaultCategories);
    }
    
    // Initial Load
    const active = loadedProjects.find(p => p.id === initialId);
    if (active) {
      setNodes(active.nodes);
      setEdges(active.edges);
      setNodeCount(active.nodes.length);
    }
  }, [setNodes, setEdges]);

  // Global Categories persistence
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }, [categories]);

  // Unified Save Effect
  useEffect(() => {
    if (!currentProjectId) return;
    
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id === currentProjectId) {
          return { ...p, nodes, edges, updatedAt: Date.now() };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      return updated;
    });
    
    localStorage.setItem(STORAGE_KEYS.CURRENT, currentProjectId);
  }, [nodes, edges, currentProjectId]);

  // Sync categories into node data
  useEffect(() => {
    setNodes((nds) => 
      nds.map(node => ({
        ...node,
        data: { ...node.data, categories }
      }))
    );
  }, [categories, setNodes]);

  // Project Management Callbacks
  const onSwitchProject = useCallback((id: string) => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      setCurrentProjectId(id);
      setNodes(proj.nodes);
      setEdges(proj.edges);
      setNodeCount(proj.nodes.length);
    }
  }, [projects, setNodes, setEdges]);

  const onCreateProject = useCallback(() => {
    const id = `proj-${Date.now()}`;
    const newProject: DeterminantProject = {
      id,
      name: 'New Health Determinant Map',
      nodes: [],
      edges: [],
      updatedAt: Date.now()
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(id);
    setNodes([]);
    setEdges([]);
    setNodeCount(0);
  }, [setNodes, setEdges]);

  const onRenameProject = useCallback((id: string, name: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, []);

  const onDeleteProject = useCallback((id: string) => {
    if (projects.length <= 1) {
      alert("Cannot delete the only project!");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const filtered = projects.filter(p => p.id !== id);
    setProjects(filtered);
    if (currentProjectId === id) {
      onSwitchProject(filtered[0].id);
    }
  }, [projects, currentProjectId, onSwitchProject]);

  // Synchronize handle counts based on current connections
  useEffect(() => {
    interface HandleRequest {
      edgeId: string;
      type: 'source' | 'target';
    }
    const edgeGroups: Record<string, Record<string, HandleRequest[]>> = {};
    const sortedEdges = [...edges].sort((a, b) => a.id.localeCompare(b.id));

    sortedEdges.forEach(edge => {
      const sSide = edge.sourceHandle?.split('-')[0];
      if (sSide) {
        if (!edgeGroups[edge.source]) edgeGroups[edge.source] = {};
        if (!edgeGroups[edge.source][sSide]) edgeGroups[edge.source][sSide] = [];
        edgeGroups[edge.source][sSide].push({ edgeId: edge.id, type: 'source' });
      }
      const tSide = edge.targetHandle?.split('-')[0];
      if (tSide) {
        if (!edgeGroups[edge.target]) edgeGroups[edge.target] = {};
        if (!edgeGroups[edge.target][tSide]) edgeGroups[edge.target][tSide] = [];
        edgeGroups[edge.target][tSide].push({ edgeId: edge.id, type: 'target' });
      }
    });

    setEdges((eds) => {
      let changed = false;
      const updatedEdges = eds.map(edge => {
        const sSide = edge.sourceHandle?.split('-')[0];
        const tSide = edge.targetHandle?.split('-')[0];
        if (!sSide && !tSide) return edge;

        let newSourceHandle = edge.sourceHandle;
        let newTargetHandle = edge.targetHandle;

        if (sSide) {
          const group = edgeGroups[edge.source]?.[sSide] || [];
          const index = group.findIndex(r => r.edgeId === edge.id && r.type === 'source');
          if (index !== -1) {
            const nextIdx = `${sSide}-source-${index}`;
            if (nextIdx !== edge.sourceHandle) {
              newSourceHandle = nextIdx;
              changed = true;
            }
          }
        }

        if (tSide) {
          const group = edgeGroups[edge.target]?.[tSide] || [];
          const index = group.findIndex(r => r.edgeId === edge.id && r.type === 'target');
          if (index !== -1) {
            const nextIdx = `${tSide}-target-${index}`;
            if (nextIdx !== edge.targetHandle) {
              newTargetHandle = nextIdx;
              changed = true;
            }
          }
        }

        if (newSourceHandle !== edge.sourceHandle || newTargetHandle !== edge.targetHandle) {
          return { ...edge, sourceHandle: newSourceHandle, targetHandle: newTargetHandle };
        }
        return edge;
      });

      return changed ? updatedEdges : eds;
    });
  }, [edges, setEdges]);

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedNode(params.nodes[0] || null);
    setSelectedEdge(params.edges[0] || null);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      // Immediate ID Normalization: ensure even the first connection has a stable '-0' suffix.
      // This prevents 'disappearing' effects during the transition to multiple handles.
      const sourceHandle = params.sourceHandle || 'top-source-0';
      const targetHandle = params.targetHandle || 'bottom-target-0';
      
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            sourceHandle,
            targetHandle,
            className: 'edge-neutral',
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  const onAddNode = useCallback(
    (type: string) => {
      const id = `node_${Date.now()}`;
      const offset = (nodeCount % 6) * 40;
      const newNode: Node = {
        id,
        type: 'determinant',
        data: { label: `New ${type}`, type },
        position: {
          x: 350 + offset,
          y: 250 + offset,
        },
      };
      setNodes((nds) => nds.concat(newNode));
      setNodeCount((prev) => prev + 1);
    },
    [setNodes, nodeCount]
  );

  const onUpdateNode = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...data } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const onUpdateEdge = useCallback((id: string, updates: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return { ...edge, ...updates };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const onDeleteEdge = useCallback((id: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
    setSelectedEdge(null);
  }, [setEdges]);

  const onFlipEdge = useCallback((id: string) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            source: edge.target,
            target: edge.source,
            sourceHandle: edge.targetHandle,
            targetHandle: edge.sourceHandle,
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const onAddCategory = useCallback((label: string, color: string) => {
    const id = `cat_${Date.now()}`;
    setCategories((prev: any) => [...prev, { id, label, color }]);
  }, []);

  const onDeleteCategory = useCallback((id: string) => {
    setCategories((prev: any) => prev.filter((c: any) => c.id !== id));
    // Reset nodes of this type to neutral/individual or structural
    setNodes((nds) => nds.map(node => {
      if (node.data.type === id) return { ...node, data: { ...node.data, type: 'individual' } };
      return node;
    }));
  }, [setNodes]);

  const onExport = useCallback((format: 'png' | 'jpg' | 'svg') => {
    if (reactFlowWrapper.current === null) return;
    
    let exportFn: any = toPng;
    let fileName = `determinant-map-${Date.now()}.png`;

    if (format === 'jpg') {
      exportFn = toJpeg;
      fileName = fileName.replace('.png', '.jpg');
    } else if (format === 'svg') {
      exportFn = toSvg;
      fileName = fileName.replace('.png', '.svg');
    }

    exportFn(reactFlowWrapper.current, {
      backgroundColor: '#ffffff',
      quality: 1,
      pixelRatio: 2,
    }).then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    });
  }, []);

  const onAutoLayout = useCallback(() => {
    setNodes((nds) =>
      nds.map((n, i) => ({
        ...n,
        position: {
          x: 400 + Math.cos(i * 1.2) * 250,
          y: 300 + Math.sin(i * 1.2) * 250,
        },
      }))
    );
  }, [setNodes]);

  return (
    <div className="app-container" ref={reactFlowWrapper}>
      <Sidebar 
        onAddNode={onAddNode} 
        onExport={onExport} 
        onAutoLayout={onAutoLayout}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        onUpdateEdge={onUpdateEdge}
        onDeleteEdge={onDeleteEdge}
        onFlipEdge={onFlipEdge}
        categories={categories}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        projects={projects}
        currentProjectId={currentProjectId}
        onSwitchProject={onSwitchProject}
        onCreateProject={onCreateProject}
        onRenameProject={onRenameProject}
        onDeleteProject={onDeleteProject}
      />
      
      <div style={{ flex: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          selectNodesOnDrag={false}
        >
          <Background color="#cbd5e1" gap={20} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DeterminantMapPage />
  </ReactFlowProvider>
);
