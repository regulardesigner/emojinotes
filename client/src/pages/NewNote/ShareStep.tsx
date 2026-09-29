import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { EmojiCard } from '../../components/EmojiCard';
import { Heading } from '../../components/Heading';
import { Toast, type ToastMessage } from '../../components/Toast';
import { findEmoji } from '../../lib/emojis';

interface ShareStepProps {
  emoji: string;
  message: string;
  url: string;
  justCreated: boolean;
}

export function ShareStep({ emoji, message, url, justCreated }: ShareStepProps) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const canShare = typeof navigator.share === 'function';

  // Set after mount: screen readers only announce live region changes, not initial content.
  useEffect(() => {
    if (!justCreated) return;
    const timer = window.setTimeout(() => setToast({ text: '💾 Your emoji-note is saved!' }), 300);
    return () => window.clearTimeout(timer);
  }, [justCreated]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setToast({ text: '📋 Link copied to clipboard!' });
    } catch {
      setToast({ text: 'Copy failed, select the link and copy it manually.' });
    }
  };

  return (
    <div className="step">
      <Toast message={toast} />
      <Heading>Share your emoji-note!</Heading>
      <EmojiCard emoji={emoji} message={message} />

      <label htmlFor="share-url" className="visually-hidden">
        Link to your emoji-note
      </label>
      <input
        id="share-url"
        className="share-url"
        value={url}
        readOnly
        onFocus={(event) => event.target.select()}
      />

      <div className="actions">
        <button className="btn" type="button" onClick={copyUrl}>
          <span aria-hidden="true">📋 </span>Copy link
        </button>
        {canShare && (
          <button
            className="btn"
            type="button"
            onClick={() => navigator.share({ title: 'An emoji-note for you', url }).catch(() => {})}
          >
            Share…
          </button>
        )}
        <button
          className="btn"
          type="button"
          aria-expanded={showQrCode}
          aria-controls="qr-code"
          onClick={() => setShowQrCode((value) => !value)}
        >
          {showQrCode ? 'Hide QR code' : 'Show QR code'}
        </button>
      </div>

      {showQrCode && (
        <div id="qr-code" className="qr-code">
          {/* Level H error correction keeps the code readable under the emoji overlay. */}
          <QRCodeSVG
            value={url}
            size={240}
            level="H"
            marginSize={2}
            title="QR code linking to your emoji-note"
          />
          <span className="qr-code-emoji" aria-hidden="true">
            {findEmoji(emoji)?.char}
          </span>
        </div>
      )}

      <Link to="/" className="legend-link">
        Back to home
      </Link>
    </div>
  );
}
