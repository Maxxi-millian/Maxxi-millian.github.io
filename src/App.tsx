import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { PortalProvider } from './app/PortalContext';
import { HomeView } from './app/HomeView';
import { DetailView } from './app/DetailView';
import { Nav, Footer } from './components/Layout';
import './styles/main.css';

function App() {
  return (
    <PortalProvider>
      <Router>
        <div className="app-shell">
          <Nav />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/p/:id" element={<DetailView />} />
              <Route path="*" element={<HomeView />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PortalProvider>
  );
}

export default App;
