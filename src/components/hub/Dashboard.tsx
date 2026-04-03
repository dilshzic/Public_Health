import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TreePine, 
  Network, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Activity
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
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="welcome-badge">
            <Activity size={14} />
            <span>Welcome back to the Analytics Hub</span>
          </div>
          <h1>Public Health Analysis</h1>
          <p>Strategic tools for causal modeling and population health determinants.</p>
        </header>

        <section className="tool-grid">
          {/* Problem Tree Card */}
          <Link to="/problem-tree" className="tool-card pt-card glass-morphism">
            <div className="card-icon-wrapper">
              <TreePine size={32} />
            </div>
            <div className="card-body">
              <h3>Problem Tree Builder</h3>
              <p>Identify root causes and consequences of complex health issues using hierarchical branch logic.</p>
            </div>
            <div className="card-footer">
              <span className="btn-label">Open Tool</span>
              <div className="btn-circle">
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>

          {/* Determinant Map Card */}
          <Link to="/determinant-map" className="tool-card dm-card glass-morphism">
            <div className="card-icon-wrapper">
              <Network size={32} />
            </div>
            <div className="card-body">
              <h3>Determinant Map</h3>
              <p>Map the levels of influence—from individual behaviors to systemic social determinants.</p>
            </div>
            <div className="card-footer">
              <span className="btn-label">Open Tool</span>
              <div className="btn-circle">
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        </section>

        <section className="recent-section">
          <div className="section-header">
            <div className="header-title">
              <Clock size={18} />
              <h3>Recent Analysis</h3>
            </div>
            {recentProjects.length > 0 && (
              <span className="project-count">{recentProjects.length} Projects</span>
            )}
          </div>

          <div className="recent-list">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => {
                const info = getToolInfo(project.type);
                return (
                  <div 
                    key={`${project.type}-${project.id}`} 
                    className="recent-item glass-morphism"
                    onClick={() => {
                      localStorage.setItem(`${project.type}-current-project`, project.id);
                      window.location.href = info.path;
                    }}
                  >
                    <div className="item-main">
                      <div className="item-icon" style={{ 
                        background: `${info.color}15`,
                        color: info.color
                      }}>
                        {info.icon}
                      </div>
                      <div className="item-details">
                        <span className="item-name">{project.name}</span>
                        <span className="item-meta">{info.label} • {new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="item-action">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state glass-morphism">
                <TrendingUp size={24} />
                <p>No recent projects. Start by selecting a builder tool above.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-wrapper {
          flex: 1;
          overflow-y: auto;
          background: var(--bg-main);
          padding: 60px 24px;
        }

        .dashboard-content {
          max-width: 1100px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 48px;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-card);
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          color: var(--accent-primary);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .dashboard-header h1 {
          font-size: 42px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
        }

        .dashboard-header p {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 600px;
        }

        .tool-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .tool-card {
          padding: 40px;
          border-radius: 32px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
        }

        .tool-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 100%);
          pointer-events: none;
        }

        .pt-card:hover {
          border-color: #22c55e;
          box-shadow: 0 20px 40px -12px rgba(34, 197, 94, 0.2);
        }

        .dm-card:hover {
          border-color: #6366f1;
          box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.2);
        }

        .tool-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .card-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }

        .pt-card .card-icon-wrapper { background: #22c55e; color: white; }
        .dm-card .card-icon-wrapper { background: #6366f1; color: white; }

        .tool-card:hover .card-icon-wrapper {
          transform: rotate(10deg) scale(1.1);
        }

        .card-body h3 {
          font-size: 24px;
          color: var(--text-primary);
          margin-bottom: 12px;
          font-family: 'Outfit', sans-serif;
        }

        .card-body p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 16px;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }

        .btn-label {
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pt-card .btn-label { color: #22c55e; }
        .dm-card .btn-label { color: #6366f1; }

        .btn-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          transition: all 0.3s;
        }

        .tool-card:hover .btn-circle {
          transform: translateX(4px);
          background: var(--text-primary);
          color: var(--bg-main);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-primary);
        }

        .header-title h3 {
          font-size: 22px;
          font-family: 'Outfit', sans-serif;
        }

        .project-count {
          font-size: 12px;
          font-weight: 700;
          background: var(--bg-card);
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .recent-item {
          padding: 20px 32px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .recent-item:hover {
          background: var(--bg-card);
          transform: translateX(12px);
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-md);
        }

        .item-main {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .item-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-name {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 16px;
        }

        .item-meta {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .item-action {
          color: var(--text-secondary);
          opacity: 0.5;
          transition: transform 0.3s;
        }

        .recent-item:hover .item-action {
          opacity: 1;
          color: var(--accent-primary);
          transform: translateX(4px);
        }

        .empty-state {
          padding: 64px;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--text-secondary);
          text-align: center;
          border: 2px dashed var(--border-color);
        }

        @media (max-width: 768px) {
          .tool-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-header h1 {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
