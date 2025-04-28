import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions = {};

function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions[location.key] = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  useEffect(() => {
    if (scrollPositions[location.key] !== undefined) {
      window.scrollTo(0, scrollPositions[location.key]);
    } else {
      window.scrollTo(0, 0); // First time visiting
    }
  }, [location]);

  return null;
}

export default ScrollRestoration;