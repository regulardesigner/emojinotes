// Keys stored in the database. Must stay in sync with client/src/lib/emojis.ts.
export const EMOJI_KEYS = ['love letter', 'heart eyes', 'christmas tree', 'tears of joy'];

// Counted in Unicode code points, like the client counter, so the limit always
// fits in the VARCHAR(255) column.
export const NOTE_MAX_LENGTH = 150;
