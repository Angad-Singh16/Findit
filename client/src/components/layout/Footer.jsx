export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <span className="font-bold text-white">FindIt</span>
          <span className="text-slate-500 text-sm">— Campus Lost & Found</span>
        </div>
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} FindIt. All rights reserved.
        </p>
      </div>
    </footer>
  );
}