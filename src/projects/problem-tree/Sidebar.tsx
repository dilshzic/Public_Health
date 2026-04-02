import React from 'react';
import { Plus, Trash2, Save, Move, Sparkles, Folder, ChevronDown } from 'lucide-react';
import { NodeType, Project } from './CustomNodes';

interface SidebarProps {
  selectedNode: any | null;
  onUpdateNode: (id: string, data: any) => void;
  onDeleteNode: (id: string) => void;
  onAddNode: (type: NodeType) => void;
  isArtistic: boolean;
  onToggleArtistic: () => void;
  onExport: (format: 'png' | 'jpeg' | 'svg') => void;
  projects: Project[];
  currentProjectId: string;
  onSwitchProject: (id: string) => void;
  onCreateProject: () => void;
  onRenameProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedNode, 
  onUpdateNode, 
  onDeleteNode, 
  onAddNode,
  isArtistic,
  onToggleArtistic,
  onExport,
  projects,
  currentProjectId,
  onSwitchProject,
  onCreateProject,
  onRenameProject,
  onDeleteProject
}) => {
  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <aside className="sidebar">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Problem Tree</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${isArtistic ? 'btn-artistic' : 'btn-secondary'}`} 
            style={{ padding: '8px', borderRadius: '50%' }}
            onClick={onToggleArtistic}
            title={isArtistic ? "Switch to Editor Mode" : "Switch to Artistic View"}
          >
            <Sparkles size={18} color={isArtistic ? 'var(--accent-color)' : 'white'} />
          </button>
        </div>
      </div>

      {/* Project Management Section */}
      <div className="project-manager">
        <label className="hub-label"><Folder size={14} /> My Projects</label>
        
        <div className="project-selector-wrapper">
          <select 
            className="hub-input" 
            value={currentProjectId}
            onChange={(e) => onSwitchProject(e.target.value)}
            style={{ paddingRight: '36px' }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="select-icon" size={16} />
        </div>

        {currentProject && (
          <div className="project-actions" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="form-group-inline" style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="hub-input"
                style={{ fontSize: '13px', padding: '6px 10px' }}
                value={currentProject.name}
                onChange={(e) => onRenameProject(currentProject.id, e.target.value)}
                placeholder="Rename project..."
              />
              <button 
                className="hub-btn" 
                style={{ padding: '8px', color: '#ef4444', borderColor: '#ef444420' }}
                onClick={() => onDeleteProject(currentProject.id)}
                title="Delete Project"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <button className="hub-btn" onClick={onCreateProject} style={{ width: '100%' }}>
              <Plus size={14} /> New Project
            </button>
          </div>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

      <div className="node-editor">
        {selectedNode ? (
          <>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="hub-label">Edit Node Label</label>
              <input 
                className="hub-input"
                type="text" 
                value={selectedNode.data.label} 
                onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, label: e.target.value })}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="hub-label">Description</label>
              <textarea 
                className="hub-input"
                rows={3}
                style={{ resize: 'none' }}
                value={selectedNode.data.description || ''} 
                onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, description: e.target.value })}
                placeholder="Add context or notes here..."
              />
            </div>

            <button className="hub-btn" style={{ color: '#ef4444', width: '100%', borderColor: '#ef444420' }} onClick={() => onDeleteNode(selectedNode.id)}>
              <Trash2 size={16} /> Delete Node
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
            <Move size={32} style={{ marginBottom: '12px', opacity: 0.2 }} />
            <p style={{ fontSize: '13px' }}>Select a node to edit details or add new elements below.</p>
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label className="hub-label">Add Elements</label>
          <button className="hub-btn primary" style={{ background: 'var(--branch-color)' }} onClick={() => onAddNode('branch')}>
            <Plus size={16} /> New Consequence
          </button>
          <button className="hub-btn primary" style={{ background: 'var(--trunk-color)' }} onClick={() => onAddNode('trunk')}>
            <Plus size={16} /> New Core Problem
          </button>
          <button className="hub-btn primary" style={{ background: 'var(--root-color)' }} onClick={() => onAddNode('root')}>
            <Plus size={16} /> New Root Cause
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label className="hub-label">Export Diagram (Hi-Res)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button className="hub-btn" style={{ padding: '8px 4px', fontSize: '11px' }} onClick={() => onExport('png')}>
              PNG
            </button>
            <button className="hub-btn" style={{ padding: '8px 4px', fontSize: '11px' }} onClick={() => onExport('jpeg')}>
              JPG
            </button>
            <button className="hub-btn" style={{ padding: '8px 4px', fontSize: '11px' }} onClick={() => onExport('svg')}>
              SVG
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <Save size={12} /> Auto-saving to LocalStorage
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
