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
      <header className="glass-morphism" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--accent-primary)', 
            color: 'white', 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Component size={20} />
          </div>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-primary)', 
            fontWeight: 800,
            fontSize: '18px',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Public Health Hub
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'var(--bg-card)', 
            padding: '4px', 
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <Link 
              to="/problem-tree" 
              className={`switcher-link ${location.pathname === '/problem-tree' ? 'active' : ''}`}
              title="Problem Tree Builder"
            >
              <TreePine size={18} />
            </Link>
            <Link 
              to="/determinant-map" 
              className={`switcher-link ${location.pathname === '/determinant-map' ? 'active' : ''}`}
              title="Determinant Map Builder"
            >
              <Network size={18} />
            </Link>
          </div>

          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              width: '36px', 
              height: '36px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
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
        .nav-link:hover {
          background: var(--bg-card);
          color: var(--accent-primary) !important;
        }
        
        .hub-container {
          background: var(--bg-main);
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        .switcher-link {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border-radius: 8px;
          transition: all 0.2s;
          text-decoration: none;
        }

        .hub-label {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          display: block;
        }

        /* Global App Container for tools */
        .app-container {
          display: flex;
          flex: 1;
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .switcher-link:hover {
          background: var(--bg-main);
          color: var(--accent-primary);
        }

        .switcher-link.active {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  );
};

export default HubLayout;
