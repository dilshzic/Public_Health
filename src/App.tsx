import { HashRouter, Routes, Route } from 'react-router-dom';
import HubLayout from './components/hub/HubLayout';
import Dashboard from './components/hub/Dashboard';
import ProblemTreePage from './projects/problem-tree/ProblemTreePage';
import DeterminantMapPage from './projects/determinant-map/DeterminantMapPage';

// Import CSS
import './styles/theme.css';
import './projects/problem-tree/problem-tree.css';
import './projects/determinant-map/determinant-map.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HubLayout />}>
          <Route index element={<Dashboard />} />
          <Route 
            path="problem-tree" 
            element={
              <div className="problem-tree-hub" style={{ height: 'calc(100vh - 60px)', width: '100%' }}>
                <ProblemTreePage />
              </div>
            } 
          />
          <Route 
            path="determinant-map" 
            element={
              <div className="determinant-map-hub" style={{ height: 'calc(100vh - 60px)', width: '100%' }}>
                <DeterminantMapPage />
              </div>
            } 
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
