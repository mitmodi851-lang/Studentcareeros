import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">SC</span>
              </div>
              <span className="font-bold text-white text-base">
                Student Career <span className="text-sky-400">OS</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your all-in-one career dashboard for discovering opportunities and finding your path.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-sky-400 transition-colors">Home</Link></li>
              <li><Link href="/events" className="hover:text-sky-400 transition-colors">Events</Link></li>
              <li><Link href="/test" className="hover:text-sky-400 transition-colors">Aptitude Test</Link></li>
              <li><Link href="/profile" className="hover:text-sky-400 transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/signup" className="hover:text-sky-400 transition-colors">Create Account</Link></li>
              <li><Link href="/auth/signin" className="hover:text-sky-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} Student Career OS. Built for students, by students.
        </div>
      </div>
    </footer>
  );
}
