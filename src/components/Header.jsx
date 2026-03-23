export default function Header() {
  return (
    <header className="w-full py-5 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L20 14L16 11L12 14Z" fill="#34d399"/>
            <path d="M16 11L23 24L16 19L9 24Z" fill="#6ee7b7"/>
            <rect x="13" y="24" width="6" height="4" rx="1" fill="#a7f3d0"/>
          </svg>
        </div>
        <span className="font-display font-semibold text-lg tracking-tight text-emerald-50">
          GreenGrid
        </span>
      </div>
      <a
        href="https://github.com/Yalamanchili7/greengrid"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-emerald-400/60 hover:text-emerald-400 transition-colors font-body"
      >
        GitHub →
      </a>
    </header>
  );
}