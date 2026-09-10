const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-4">
      <aside className="grid-flow-col items-center">
        <p>© {new Date().getFullYear()} ClassPulse — built by Jahnabi Sarma</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a
          href="https://github.com/Jahnabi926/classpulse-backend"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          Backend
        </a>
        <a
          href="https://github.com/Jahnabi926/classpulse-frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          Frontend
        </a>
        <a
          href="https://linkedin.com/in/jahnabi-sarma"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          LinkedIn
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
