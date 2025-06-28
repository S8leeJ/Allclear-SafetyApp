import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Friends from './pages/Friends';
import Testing from './pages/Testing';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div className="font-roboto relative min-h-screen bg-gradient-to-b from-black via-blue-1000 to-blue-700 text-white overflow-hidden">
        <Navbar />
        
        <div className="ml-64 relative min-h-screen">
          <div className="max-w-5xl mx-auto px-8 py-12 z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
