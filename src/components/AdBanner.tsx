import { useEffect, useRef } from 'react';

interface AdBannerProps {
  htmlCode?: string;
  className?: string;
}

export function AdBanner({ htmlCode, className }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !htmlCode) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    // Create a range to parse the HTML and execute scripts
    const range = document.createRange();
    const documentFragment = range.createContextualFragment(htmlCode);
    
    containerRef.current.appendChild(documentFragment);
  }, [htmlCode]);

  if (!htmlCode) return null;

  return (
    <div 
      ref={containerRef} 
      className={`ad-container overflow-hidden flex justify-center ${className}`}
    />
  );
}
