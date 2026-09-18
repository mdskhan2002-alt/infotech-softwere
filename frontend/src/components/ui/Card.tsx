import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = true,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl border p-6 backdrop-blur-xl',
        interactive ? 'glass-card' : 'glass-panel',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
