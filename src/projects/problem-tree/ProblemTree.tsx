import React, { useCallback, useEffect, useState } from 'react';
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
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes, NodeType, Project } from './CustomNodes';
import { OrganicEdge } from './OrganicEdge';
import { useExport } from '../../hooks/useExport';
import Sidebar from './Sidebar';
import { TreeRenderer } from './TreeRenderer';

const initialNodes: Node[] = [
  {
    id: 'trunk-1',
    type: 'trunk',
    data: { label: 'High Child Mortality Rate', description: 'Significant increase in mortality for children under 5 in Rural Province X.' },
    position: { x: 50, y: 250 },
  },
  {
    id: 'root-1',
    type: 'root',
    data: { label: 'Lack of Clean Water', description: 'Limited access to potable water sources.' },
    position: { x: -200, y: 450 },
  },
  {
    id: 'root-2',
    type: 'root',
    data: { label: 'Poor Sanitation Infrastructure', description: 'Inadequate waste management systems.' },
    position: { x: 300, y: 450 },
  },
  {
    id: 'branch-1',
    type: 'branch',
    data: { label: 'Strained Health Services', description: 'Hospitals overwhelmed with preventable diseases.' },
    position: { x: -200, y: 50 },
  },
  {
    id: 'branch-2',
    type: 'branch',
    data: { label: 'Economic Loss for Families', description: 'Loss of income due to illness care.' },
    position: { x: 300, y: 50 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-r1-t1', source: 'root-1', target: 'trunk-1' },
  { id: 'e-r2-t1', source: 'root-2', target: 'trunk-1' },
  { id: 'e-t1-b1', source: 'trunk-1', target: 'branch-1' },
  { id: 'e-t1-b2', source: 'trunk-1', target: 'branch-2' },
];

const edgeTypes = {
  organic: OrganicEdge,
};

const ProblemTree: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  const selectedNode = nodes.find((node) => node.selected) || null;
  const [isArtistic, setIsArtistic] = useState(false);
  const { exportImage } = useExport();

  // Load from LocalStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('problem-tree-projects');
    const lastProjectId = localStorage.getItem('problem-tree-current-project');
    
    let loadedProjects: Project[] = [];
    
    if (savedProjects) {
      loadedProjects = JSON.parse(savedProjects);
    } else {
      // Migration logic from old single-project format
      const oldSaved = localStorage.getItem('problem-tree-data');
      if (oldSaved) {
        const { nodes: oldNodes, edges: oldEdges, isArtistic: oldMode } = JSON.parse(oldSaved);
        loadedProjects = [{
          id: 'default',
          name: 'Default Project',
          nodes: oldNodes || initialNodes,
          edges: oldEdges || initialEdges,
          isArtistic: !!oldMode,
          updatedAt: Date.now()
        }];
      } else {
        // Initial setup
        loadedProjects = [{
          id: 'default',
          name: 'My First Problem Tree',
          nodes: initialNodes,
          edges: initialEdges,
          isArtistic: false,
          updatedAt: Date.now()
        }];
      }
    }
    
    setProjects(loadedProjects);
    const initialId = lastProjectId && loadedProjects.find(p => p.id === lastProjectId) 
      ? lastProjectId 
      : loadedProjects[0].id;
    
    setCurrentProjectId(initialId);
    
    // Load the initial project data
    const activeProject = loadedProjects.find(p => p.id === initialId);
    if (activeProject) {
      setNodes(activeProject.nodes);
      setEdges(activeProject.edges);
      setIsArtistic(activeProject.isArtistic);
    }
  }, [setNodes, setEdges]);

  // Auto-save the current project to the project list whenever data changes
  useEffect(() => {
    if (!currentProjectId) return;
    
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id === currentProjectId) {
          return {
            ...p,
            nodes,
            edges,
            isArtistic,
            updatedAt: Date.now()
          };
        }
        return p;
      });
      localStorage.setItem('problem-tree-projects', JSON.stringify(updated));
      return updated;
    });
    
    localStorage.setItem('problem-tree-current-project', currentProjectId);
  }, [nodes, edges, isArtistic, currentProjectId]);

  const onSwitchProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProjectId(id);
      setNodes(project.nodes);
      setEdges(project.edges);
      setIsArtistic(project.isArtistic);
    }
  }, [projects, setNodes, setEdges]);

  const onCreateProject = useCallback(() => {
    const newId = `project-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      name: 'New Problem Tree',
      nodes: initialNodes,
      edges: initialEdges,
      isArtistic: false,
      updatedAt: Date.now()
    };
    
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newId);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setIsArtistic(false);
  }, [setNodes, setEdges]);

  const onRenameProject = useCallback((id: string, name: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, []);

  const onDeleteProject = useCallback((id: string) => {
    if (projects.length <= 1) {
      alert("Cannot delete the only project. Create another one first!");
      return;
    }
    
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    const filtered = projects.filter(p => p.id !== id);
    setProjects(filtered);
    
    if (currentProjectId === id) {
      onSwitchProject(filtered[0].id);
    }
  }, [projects, currentProjectId, onSwitchProject]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === node.id })));
  }, [setNodes]);

  const onPaneClick = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, [setNodes]);

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
  }, [setNodes, setEdges]);

  const onAddNode = useCallback((type: NodeType) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      selected: true,
      data: { 
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`, 
        description: '',
        isArtistic 
      },
      position: { x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 },
    };
    setNodes((nds) => [...nds.map(n => ({ ...n, selected: false })), newNode]);
  }, [setNodes, isArtistic]);

  const onToggleArtistic = useCallback(() => {
    setIsArtistic((prev) => {
      const newArtisticMode = !prev;

      // Update all nodes' visual data
      setNodes((nds) => nds.map(node => ({
        ...node,
        data: { ...node.data, isArtistic: newArtisticMode }
      })));

      // Update all edges to organic type if mode is artistic
      setEdges((eds) => eds.map(edge => ({
        ...edge,
        type: newArtisticMode ? 'organic' : 'default'
      })));

      if (newArtisticMode) {
        // Perform Auto-Layout
        setNodes((nds) => {
          const trunks = nds.filter(n => n.type === 'trunk');
          const branches = nds.filter(n => n.type === 'branch');
          const roots = nds.filter(n => n.type === 'root');

          return nds.map(node => {
            let position = node.position;
            
            if (node.type === 'trunk') {
              const index = trunks.indexOf(node);
              position = { x: index * 600, y: 250 };
            } else if (node.type === 'branch') {
              const index = branches.indexOf(node);
              const xOffset = (index - (branches.length - 1) / 2) * 400;
              position = { x: xOffset, y: -50 };
            } else if (node.type === 'root') {
              const index = roots.indexOf(node);
              const xOffset = (index - (roots.length - 1) / 2) * 400;
              position = { x: xOffset, y: 550 };
            }

            return { ...node, position };
          });
        });
      }
      return newArtisticMode;
    });
  }, [setNodes, setEdges]);

  return (
    <div className="app-container">
      <div style={{ flex: 1, height: '100%' }} id="problem-tree-container">
        <ReactFlow
          nodes={nodes}
          edges={isArtistic ? [] : edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          {isArtistic && <TreeRenderer />}
          <Background color="#334155" gap={20} variant={isArtistic ? BackgroundVariant.Lines : BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
      </div>

      <Sidebar 
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        onAddNode={onAddNode}
        isArtistic={isArtistic}
        onToggleArtistic={onToggleArtistic}
        onExport={(format: 'png' | 'jpeg' | 'svg') => exportImage(format)}
        projects={projects}
        currentProjectId={currentProjectId}
        onSwitchProject={onSwitchProject}
        onCreateProject={onCreateProject}
        onRenameProject={onRenameProject}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
};

const ProblemTreeWithProvider = () => (
  <ReactFlowProvider>
    <ProblemTree />
  </ReactFlowProvider>
);

export default ProblemTreeWithProvider;
