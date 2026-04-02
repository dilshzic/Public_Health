import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowLeftRight, 
  Layout, 
  Activity, 
  Users, 
  Briefcase, 
  Globe, 
  Heart,
  Circle,
  Settings,
  Palette,
  FolderOpen,
  ChevronDown
} from 'lucide-react';
import { Node, Edge } from 'reactflow';
import { DeterminantProject } from './DeterminantMapPage';

interface SidebarProps {
  onAddNode: (type: string) => void;
  onExport: (format: 'png' | 'jpg' | 'svg') => void;
  onAutoLayout: () => void;
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onUpdateNode: (id: string, data: any) => void;
  onDeleteNode: (id: string) => void;
  onUpdateEdge: (id: string, updates: any) => void;
  onDeleteEdge: (id: string) => void;
  onFlipEdge: (id: string) => void;
  categories: any[];
  onAddCategory: (label: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  projects: DeterminantProject[];
  currentProjectId: string;
  onSwitchProject: (id: string) => void;
  onCreateProject: () => void;
  onRenameProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
}

const Sidebar = ({
  onAddNode,
  onExport,
  onAutoLayout,
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onDeleteNode,
  onUpdateEdge,
  onDeleteEdge,
  onFlipEdge,
  categories,
  onAddCategory,
  onDeleteCategory,
  projects,
  currentProjectId,
  onSwitchProject,
  onCreateProject,
  onRenameProject,
  onDeleteProject
}: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<'add' | 'node' | 'edge' | 'categories'>('add');
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  const currentProject = projects.find(p => p.id === currentProjectId);

  React.useEffect(() => {
    if (selectedNode) setActiveTab('node');
    else if (selectedEdge) setActiveTab('edge');
  }, [selectedNode, selectedEdge]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatLabel.trim()) {
      onAddCategory(newCatLabel, newCatColor);
      setNewCatLabel('');
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Activity': return <Activity size={16} />;
      case 'Users': return <Users size={16} />;
      case 'Briefcase': return <Briefcase size={16} />;
      case 'Globe': return <Globe size={16} />;
      case 'Heart': return <Heart size={16} />;
      default: return <Circle size={16} />;
    }
  };

  const edgeColors = [
    { className: 'edge-neutral', label: 'Neutral', color: '#94a3b8' },
    { className: 'edge-positive', label: 'Positive (+)', color: '#10b981' },
    { className: 'edge-negative', label: 'Negative (-)', color: '#ef4444' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Determinant Map</h2>
        <p>Public Health Visualization</p>
      </div>

      <div className="project-section" style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <label className="hub-label"><FolderOpen size={14} /> Project Management</label>
        
        <div className="project-select-container" style={{ position: 'relative', marginBottom: '12px' }}>
          <select 
            className="hub-input"
            value={currentProjectId}
            onChange={(e) => onSwitchProject(e.target.value)}
            style={{ paddingRight: '40px' }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <ChevronDown className="dropdown-icon" size={14} style={{ position: 'absolute', right: '12px', top: '14px', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
        </div>

        {currentProject && (
          <div className="project-actions-row" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input 
              type="text"
              className="hub-input"
              value={currentProject.name}
              onChange={(e) => onRenameProject(currentProject.id, e.target.value)}
              placeholder="Edit project name..."
              style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
            />
            <button 
              className="hub-btn" 
              onClick={() => onDeleteProject(currentProject.id)} 
              style={{ padding: '8px', color: '#ef4444', borderColor: '#ef444420' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}

        <button className="hub-btn" onClick={onCreateProject} style={{ width: '100%', borderStyle: 'dashed' }}>
          <Plus size={14} /> New Project
        </button>
      </div>

      <div className="sidebar-tabs">
        <button 
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <Plus size={14} /> Add
        </button>
        <button 
          className={`tab-button ${activeTab === 'node' ? 'active' : ''}`}
          disabled={!selectedNode}
          onClick={() => setActiveTab('node')}
        >
          <Settings size={14} /> Node
        </button>
        <button 
          className={`tab-button ${activeTab === 'edge' ? 'active' : ''}`}
          disabled={!selectedEdge}
          onClick={() => setActiveTab('edge')}
        >
          <ArrowLeftRight size={14} /> Edge
        </button>
        <button 
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Palette size={14} /> Style
        </button>
      </div>

      <div className="tab-content" style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'add' && (
          <div className="tool-section" style={{ padding: '20px' }}>
            <div className="hub-label">New Determinant</div>
            <div className="category-list-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((cat) => (
                <button 
                  key={cat.id} 
                  className="hub-btn" 
                  onClick={() => onAddNode(cat.id)}
                  style={{ justifyContent: 'flex-start', borderLeft: `4px solid ${cat.color}` }}
                >
                  {getIcon(cat.icon)} {cat.label}
                </button>
              ))}
            </div>
            
            <div className="hub-label" style={{ marginTop: '24px' }}>Canvas Actions</div>
            <button className="hub-btn" style={{ width: '100%' }} onClick={onAutoLayout}>
              <Layout size={18} /> Auto Arrange
            </button>
          </div>
        )}

        {activeTab === 'node' && selectedNode && (
          <div className="tool-section" style={{ padding: '20px' }}>
            <div className="hub-label">Edit Determinant</div>
            <div className="settings-input-group" style={{ marginBottom: '20px' }}>
              <label className="hub-label" style={{ fontSize: '12px', opacity: 0.8 }}>Node Label</label>
              <input 
                className="hub-input"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, label: e.target.value })}
              />
            </div>

            <div className="settings-input-group" style={{ marginBottom: '24px' }}>
              <label className="hub-label" style={{ fontSize: '12px', opacity: 0.8 }}>Category</label>
              <div className="type-select-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    className={`type-option ${selectedNode.data.type === cat.id ? 'active' : ''}`}
                    onClick={() => onUpdateNode(selectedNode.id, { ...selectedNode.data, type: cat.id })}
                    style={{ 
                      padding: '8px', 
                      borderRadius: '10px', 
                      border: '1.5px solid var(--border-color)', 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      ...(selectedNode.data.type === cat.id ? { borderColor: cat.color, background: `${cat.color}15` } : {})
                    }}
                  >
                    {cat.label.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="hub-btn" 
              style={{ width: '100%', color: '#ef4444', borderColor: '#ef444420' }}
              onClick={() => onDeleteNode(selectedNode.id)}
            >
              <Trash2 size={16} /> Delete Node
            </button>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="tool-section">
            <div className="section-label">Manage Categories</div>
            
            <form onSubmit={handleAddCategory} className="settings-input-group" style={{ marginBottom: '20px' }}>
              <label>Add New Category</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  className="settings-input"
                  placeholder="e.g. Economic"
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                />
                <input 
                  type="color" 
                  value={newCatColor} 
                  onChange={(e) => setNewCatColor(e.target.value)} 
                  style={{ width: '40px', padding: '0', border: 'none', height: '38px', borderRadius: '8px' }}
                />
                <button type="submit" className="tool-button" style={{ padding: '8px' }}>
                  <Plus size={18} />
                </button>
              </div>
            </form>

            <div className="section-label">Existing Types</div>
            <div className="category-manage-list">
              {categories.map(cat => (
                <div key={cat.id} className="category-manage-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }} />
                    <span>{cat.label}</span>
                  </div>
                  {!['individual', 'social', 'structural', 'outcome', 'lifestyle', 'working'].includes(cat.id) && (
                    <button onClick={() => onDeleteCategory(cat.id)} className="icon-only-button">
                      <Trash2 size={14} color="#f43f5e" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'edge' && selectedEdge && (
          <div className="tool-section" style={{ padding: '20px' }}>
            <div className="hub-label">Relationship Settings</div>

            <div className="settings-input-group" style={{ marginBottom: '20px' }}>
              <label className="hub-label" style={{ fontSize: '12px', opacity: 0.8 }}>Influence Nature</label>
              <div className="color-select-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {edgeColors.map((c) => (
                  <div 
                    key={c.className}
                    className={`color-option ${selectedEdge.className === c.className ? 'active' : ''}`}
                    style={{ 
                      height: '32px', 
                      borderRadius: '8px', 
                      backgroundColor: c.color, 
                      cursor: 'pointer',
                      border: selectedEdge.className === c.className ? '2px solid var(--text-primary)' : '2px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={c.label}
                    onClick={() => onUpdateEdge(selectedEdge.id, { className: c.className })}
                  >
                    {selectedEdge.className === c.className && <Circle size={12} color="white" fill="white" />}
                  </div>
                ))}
              </div>
            </div>

            <button className="hub-btn" onClick={() => onFlipEdge(selectedEdge.id)} style={{ width: '100%', marginBottom: '12px' }}>
              <ArrowLeftRight size={18} /> Flip Direction
            </button>
            <button 
              className="hub-btn" 
              style={{ width: '100%', color: '#ef4444', borderColor: '#ef444420' }}
              onClick={() => onDeleteEdge(selectedEdge.id)}
            >
              <Trash2 size={16} /> Delete Connection
            </button>
          </div>
        )}
      </div>

      <div className="export-section" style={{ padding: '20px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <div className="hub-label">Export Diagram</div>
        <div className="export-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
          <button className="hub-btn" style={{ padding: '8px 4px', fontSize: '11px' }} onClick={() => onExport('png')}>
            PNG
          </button>
          <button className="hub-btn" style={{ padding: '8px 4px', fontSize: '11px' }} onClick={() => onExport('jpg')}>
            JPG
          </button>
          <button className="hub-btn" style={{ padding: '8px 4px', fontSize: '11px' }} onClick={() => onExport('svg')}>
            SVG
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
