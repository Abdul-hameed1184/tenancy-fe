export function Footer() {
  return (
    <footer className="border-t border-navy-700/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
         <img src="/pleet-logo.png" alt="Pleet" className="w-12 h-12" />
          <span className="text-base font-extrabold tracking-tight text-white">PLEET</span>
        </div>
        <p className="text-sm text-navy-400">
          &copy; {new Date().getFullYear()} PLEET Technologies. Premium Tenancy Management for
          Nigeria.
        </p>
        <div className="flex items-center gap-6 text-sm text-navy-400">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
