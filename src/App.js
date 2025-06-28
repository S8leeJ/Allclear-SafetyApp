import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Friends from './pages/Friends';
import Testing from './pages/Testing';

export default function App() {
  return (
    <Router>
      <div className="font-roboto relative min-h-screen bg-gradient-to-b from-black via-blue-1000 to-blue-700 text-white overflow-hidden">
    
        <div className="relative max-w-5xl mx-auto px-4 py-12 z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/testing" element={<Testing />} />

          </Routes>
        </div>
      </div>
    </Router>

  );
}
