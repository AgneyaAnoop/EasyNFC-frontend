
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}