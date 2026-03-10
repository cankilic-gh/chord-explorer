
import React from 'react';

const EmberParticles: React.FC = () => {
  // Main embers - crimson/orange, slower, larger
  const mainEmbers = [
    { left: 5, delay: 0, duration: 18, size: 3 },
    { left: 15, delay: 6, duration: 22, size: 2.5 },
    { left: 28, delay: 2, duration: 16, size: 2 },
    { left: 42, delay: 10, duration: 20, size: 3.5 },
    { left: 55, delay: 4, duration: 17, size: 2 },
    { left: 68, delay: 12, duration: 24, size: 2.5 },
    { left: 78, delay: 8, duration: 19, size: 3 },
    { left: 90, delay: 14, duration: 21, size: 2 },
  ];

  // Tiny sparks - gold/bright, faster, smaller
  const sparks = [
    { left: 10, delay: 3, duration: 12, size: 1.5 },
    { left: 22, delay: 9, duration: 14, size: 1 },
    { left: 35, delay: 1, duration: 11, size: 1.5 },
    { left: 50, delay: 7, duration: 13, size: 1 },
    { left: 62, delay: 5, duration: 10, size: 1.5 },
    { left: 75, delay: 11, duration: 15, size: 1 },
    { left: 85, delay: 3, duration: 12, size: 1.5 },
    { left: 95, delay: 8, duration: 11, size: 1 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" style={{ contain: 'strict' }}>
      {mainEmbers.map((p, i) => (
        <div
          key={`main-${i}`}
          className="ember-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
      {sparks.map((p, i) => (
        <div
          key={`spark-${i}`}
          className="ember-particle-alt"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default EmberParticles;
