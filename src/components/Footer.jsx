export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 text-center border-t border-emerald-900/30">
      <p className="text-sm text-emerald-50/30 font-body">
        Built with ☀️ by{' '}
        <a href="https://www.linkedin.com/in/yalamanchilisundeep" target="_blank" rel="noopener noreferrer" className="text-emerald-400/50 hover:text-emerald-400 transition-colors">
          Sundeep Yalamanchili
        </a>
      </p>
      <p className="text-xs text-emerald-50/15 mt-2 font-body">
        Solar data powered by NREL PVWatts API · Carbon data from EPA eGRID · Rates from EIA
      </p>
    </footer>
  );
}