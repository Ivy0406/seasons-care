import { useEffect, useRef, useState } from 'react';

function useSnapObserver(threshold = 0.5) {
  const rootRef = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLElement>(null);
  const [isSnapped, setIsSnapped] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSnapped(!entry.isIntersecting);
      },
      {
        root: rootRef.current,
        threshold,
      },
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { rootRef, targetRef, isSnapped };
}

export default useSnapObserver;
