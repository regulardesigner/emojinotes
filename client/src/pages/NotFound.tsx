import { Link } from 'react-router';

import { Heading } from '../components/Heading';

export function NotFound() {
  return (
    <>
      <title>Page not found · Emoji-notes</title>
      <Heading>
        <span aria-hidden="true">🕵️ </span>Page not found
      </Heading>
      <Link to="/" className="btn">
        Back to home
      </Link>
    </>
  );
}
