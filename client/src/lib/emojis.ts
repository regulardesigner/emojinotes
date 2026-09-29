// Keys are stored in the database. Must stay in sync with server/src/emojis.js.
export const EMOJIS = [
  { key: 'love letter', char: '💌', label: 'Love letter' },
  { key: 'heart eyes', char: '😍', label: 'Smiling face with heart-eyes' },
  { key: 'christmas tree', char: '🎄', label: 'Christmas tree' },
  { key: 'tears of joy', char: '😂', label: 'Face with tears of joy' },
] as const;

export type Emoji = (typeof EMOJIS)[number];
export type EmojiKey = Emoji['key'];

export const findEmoji = (key: string): Emoji | undefined => EMOJIS.find((e) => e.key === key);

export const NOTE_MAX_LENGTH = 150;

// Counts code points rather than UTF-16 units, so an emoji counts as one character,
// matching the server-side validation.
export const countChars = (text: string) => [...text].length;
