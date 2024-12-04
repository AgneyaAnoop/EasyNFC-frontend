import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // List of routes that don't need the header
  const noHeaderRoutes = ['/', '/login', '/register', '/[slug]'];
  
  // Check if current route should have header
  const shouldShowHeader = !noHeaderRoutes.includes(router.pathname);

  if (shouldShowHeader) {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }

  return <Component {...pageProps} />;
}

export default MyApp;