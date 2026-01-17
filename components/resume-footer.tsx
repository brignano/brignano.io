export default function Footer() {
  return (
    <footer className="border-t dark:border-zinc-800 border-zinc-200 mt-20">
      <div className="max-w-7xl mx-auto md:px-16 px-6 py-10">
        <div className="text-center">
          <p className="text-sm dark:text-zinc-400 text-zinc-600">
            © {new Date().getFullYear()} Resume App. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
