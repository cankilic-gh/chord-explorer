
import React from 'react';

const EmberParticles: React.FC = () => {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: 10 + (i * 16),
    delay: i * 4,
    duration: 14 + i * 3,
    size: 1.5 + (i % 3),
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" style={{ contain: 'strict' }}>
      {particles.map(p => (
        <div
          key={p.id}
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
    </div>
  );
};

export default EmberParticles;
