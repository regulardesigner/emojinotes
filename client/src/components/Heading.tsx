import { useEffect, useRef, type ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  // Moves focus to the heading when it appears, so keyboard and screen reader users land
  // on the new content after a step or page change instead of on <body>.
  autoFocus?: boolean;
}

export function Heading({ children, autoFocus = true }: HeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <h1 ref={ref} tabIndex={-1} className="title">
      {children}
    </h1>
  );
}
