import { useState, useEffect } from 'react';

function useWindowScroll() {
  const [windowScroll, setWindowScroll] = useState(window.scrollY);

  useEffect(() => {
    function handleScroll() {
      setWindowScroll(window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return windowScroll;
}
export default useWindowScroll;
