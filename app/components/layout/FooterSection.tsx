export default function FooterSection() {
  return (
    <footer className="py-8 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} <span className="text-accent font-mono">Retr0_</span>. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
