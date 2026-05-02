import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}