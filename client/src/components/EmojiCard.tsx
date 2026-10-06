import { findEmoji } from '../lib/emojis';

interface EmojiCardProps {
  emoji: string;
  message: string;
}

export function EmojiCard({ emoji, message }: EmojiCardProps) {
  const found = findEmoji(emoji);
  return (
    <figure className="card">
      <span className="card-emoji" role="img" aria-label={found?.label ?? 'Emoji'}>
        {found?.char ?? '🕴️'}
      </span>
      <blockquote className="card-message">{message}</blockquote>
    </figure>
  );
}
