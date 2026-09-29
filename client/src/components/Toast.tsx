import { useEffect, useState } from 'react';

export interface ToastMessage {
  text: string;
}

interface ToastProps {
  // Pass a new object to show the toast again, even with the same text.
  message: ToastMessage | null;
  duration?: number;
}

// The live region stays mounted so screen readers announce each new message.
export function Toast({ message, duration = 2500 }: ToastProps) {
  const [dismissed, setDismissed] = useState<ToastMessage | null>(null);
  const visible = message !== null && message !== dismissed;

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setDismissed(message), duration);
    return () => window.clearTimeout(timer);
  }, [message, duration]);

  return (
    <div className={visible ? 'toast show' : 'toast'} role="status" aria-live="polite">
      {visible ? message?.text : null}
    </div>
  );
}
