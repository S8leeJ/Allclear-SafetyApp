import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="px-6 py-5 flex justify-between items-center text-2xl">
      <h1 className="text-1xl font-bold text-white-100">AllClear</h1>
      <div className="space-x-5">
        <Link to="/" className="text-white-400 hover:text-blue-400">Home</Link>
        <Link to="/friends" className="text-white-400 hover:text-blue-400">Friends</Link>
      </div>
    </nav>
  );
}
