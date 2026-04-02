import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TreePine, 
  Network, 
  Clock, 
  ArrowRight, 
  ChevronRight
} from 'lucide-react';

interface RecentProject {
  id: string;
  name: string;
  type: 'problem-tree' | 'determinant-map';
  updatedAt: number;
}

const Dashboard = () => {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    const ptProjects = JSON.parse(localStorage.getItem('problem-tree-projects') || '[]');
    const dmProjects = JSON.parse(localStorage.getItem('determinant-map-projects') || '[]');

    const combined: RecentProject[] = [
      ...ptProjects.map((p: any) => ({ ...p, type: 'problem-tree' })),
      ...dmProjects.map((p: any) => ({ ...p, type: 'determinant-map' }))
    ];

    combined.sort((a, b) => b.updatedAt - a.updatedAt);
    setRecentProjects(combined.slice(0, 5));
  }, []);

  const getToolInfo = (type: 'problem-tree' | 'determinant-map') => {
    if (type === 'problem-tree') {
      return {
        label: 'Problem Tree',
        icon: <TreePine size={16} />,
        color: '#22c55e',
        path: '/problem-tree'
      };
    }
    return {
      label: 'Determinant Map',
      icon: <Network size={16} />,
      color: '#6366f1',
      path: '/determinant-map'
    };
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Welcome to the Hub</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Select a tool to start your public health analysis.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        {/* Problem Tree Card */}
        <Link to="/problem-tree" className="tool-card glass-morphism" style={{ 
          textDecoration: 'none', 
          padding: '32px', 
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          transition: 'all 0.3s'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '16px', 
            background: '#22c55e20', 
            color: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TreePine size={32} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Problem Tree Builder</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px' }}>
              Deconstruct complex health issues into roots, trunks, and branches to find systemic solutions.
            </p>
          </div>
          <div className="card-footer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: 600 }}>
            Launch Tool <ArrowRight size={18} />
          </div>
        </Link>

        {/* Determinant Map Card */}
        <Link to="/determinant-map" className="tool-card glass-morphism" style={{ 
          textDecoration: 'none', 
          padding: '32px', 
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          transition: 'all 0.3s'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '16px', 
            background: '#6366f120', 
            color: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Network size={32} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Determinant Map Builder</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px' }}>
              Visualize the Dahlgren-Whitehead rainbow of health determinants and their causal relationships.
            </p>
          </div>
          <div className="card-footer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: 600 }}>
            Launch Tool <ArrowRight size={18} />
          </div>
        </Link>
      </div>

      {/* Recent Projects Section */}
      <div className="recent-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Clock size={20} color="var(--text-secondary)" />
          <h3 style={{ margin: 0, fontSize: '20px' }}>Recent Projects</h3>
        </div>

        {recentProjects.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentProjects.map((project) => {
              const info = getToolInfo(project.type);
              return (
                <div 
                  key={`${project.type}-${project.id}`} 
                  className="project-item glass-morphism"
                  onClick={() => {
                    localStorage.setItem(`${project.type}-current-project`, project.id);
                    window.location.href = info.path;
                  }}
                  style={{ 
                    padding: '16px 24px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '10px', 
                      background: `${info.color}15`,
                      color: info.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {info.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{info.label} • Updated {new Date(project.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-secondary)" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-morphism" style={{ padding: '40px', borderRadius: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No recent projects found. Start by selecting a tool above.
          </div>
        )}
      </div>

      <style>{`
        .tool-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-primary);
        }
        
        .project-item:hover {
          background: var(--bg-card);
          transform: translateX(5px);
          border-color: var(--accent-primary);
        }
        
        .project-item:hover .outfit {
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
