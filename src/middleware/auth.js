import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    
    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
        }
      };
      
      checkAuth();
    }, [router]); // Added router to dependency array

    return <Component {...props} />;
  };
}