import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import TiltedCard from './react-bits/TiltedCard.jsx';

// React Bits is a progressive enhancement. Original links and images work without JS.
function ProjectImage({ src, alt }) {
  const host = useRef(null);
  const [height, setHeight] = React.useState(280);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.width * 9 / 16));
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} style={{ width: '100%', aspectRatio: '16/9' }}>
    <TiltedCard imageSrc={src} altText={alt} containerHeight={height} imageWidth="100%"
      imageHeight={height} rotateAmplitude={4} scaleOnHover={1.015} showTooltip={false}
      intro={false} floating={false} gyroscope={false} glare={0} shadow={0} radius={4} parallax={0} />
  </div>;
}

// Touch and reduced-motion users keep the static, accessible original image.
if (matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const illustration = document.querySelector('.hero-art');
  if (illustration) {
    // This is trusted, local illustration markup; keep its static HTML fallback.
    const artwork = illustration.innerHTML;
    createRoot(illustration).render(
      <TiltedCard containerHeight="100%" imageHeight="100%" imageWidth="100%"
        rotateAmplitude={3} scaleOnHover={1} showTooltip={false} intro={false}
        gyroscope={false} floating={false} glare={0} shadow={0} parallax={0}>
        <div className="hero-art-scene" dangerouslySetInnerHTML={{ __html: artwork }} />
      </TiltedCard>
    );
  }
  document.querySelectorAll('.project-image-link > img').forEach(image => {
    const host = document.createElement('div');
    host.className = 'project-react-image';
    const { src, alt } = image;
    image.replaceWith(host);
    createRoot(host).render(<ProjectImage src={src} alt={alt} />);
  });
}
