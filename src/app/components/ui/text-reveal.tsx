import { ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  variant?: 'blur' | 'default';
  className?: string;
  delay?: number;
}

export function TextReveal({ children, variant = 'default', className = '', delay = 0 }: TextRevealProps) {
  if (variant === 'blur') {
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          animation: 'blur-reveal 1200ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
          animationDelay: `${delay}ms`,
          opacity: 0,
          filter: 'blur(10px)',
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        animation: 'fade-in 800ms ease-out forwards',
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      {children}
    </span>
  );
}
