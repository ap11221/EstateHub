export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-extrabold text-lg mb-2">EstateHub</h3>
          <p className="text-sm text-brand-200">
            Find your next home or list your property — flats, bungalows, houses & villas, all in one place.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1 text-brand-200">
            <li>Browse Properties</li>
            <li>List Your Property</li>
            <li>My Favorites</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p className="text-sm text-brand-200">support@estatehub.example</p>
          <p className="text-sm text-brand-200">+91 98765 43210</p>
        </div>
      </div>
      <div className="text-center text-xs text-brand-300 py-4 border-t border-brand-800">
        © {new Date().getFullYear()} EstateHub. Demo project for learning purposes.
      </div>
    </footer>
  );
}
