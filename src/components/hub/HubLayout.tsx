import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Component,
  TreePine,
  Network
} from 'lucide-react';

const HubLayout = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hub-theme') || 'light';
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hub-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };


  return (
    <div className="hub-container">
      <header className="hub-header glass-morphism">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <div className="hub-logo">
              <Component size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                color: 'var(--text-primary)', 
                fontWeight: 800,
                fontSize: '16px',
                fontFamily: 'Outfit, sans-serif',
                lineHeight: 1.1
              }}>
                Public Health
              </span>
              <span style={{ 
                color: 'var(--accent-primary)', 
                fontSize: '10px', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Analysis Hub
              </span>
            </div>
          </Link>
        </div>

        <nav className="hub-nav">
          <div className="nav-group">
            <Link 
              to="/problem-tree" 
              className={`nav-item ${location.pathname === '/problem-tree' ? 'active' : ''}`}
            >
              <TreePine size={18} />
              <span>Problem Tree</span>
            </Link>
            <Link 
              to="/determinant-map" 
              className={`nav-item ${location.pathname === '/determinant-map' ? 'active' : ''}`}
            >
              <Network size={18} />
              <span>Determinant Map</span>
            </Link>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 8px' }} />

          <button 
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>
      </header>

      <main style={{ 
        marginTop: '60px', 
        flex: 1, 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </main>

      <style>{`
        .hub-container {
          background: var(--bg-main);
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        .hub-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }

        .hub-logo {
          background: var(--accent-primary);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          alignItems: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .hub-nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-group {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--bg-card);
          padding: 4px;
          border-radius: 14px;
          border: 1px solid var(--border-color);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item:hover {
          background: var(--bg-main);
          color: var(--accent-primary);
        }

        .nav-item.active {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }

        .theme-toggle-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-toggle-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
          border-color: var(--accent-primary);
        }

        .app-container {
          display: flex;
          flex: 1;
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HubLayout;
