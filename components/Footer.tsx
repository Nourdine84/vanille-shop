export default function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="container py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Vanille Shop — Tous droits réservés.
      </div>
    </footer>
  );
}
