import { Link } from 'react-router';

export function Home() {
  return (
    <>
      <h1 className="title">
        <span aria-hidden="true">💌 </span>Emoji-notes
      </h1>
      <p className="baseline">Send nice messages to your friends!</p>
      <Link to="/new" className="btn">
        Create an emoji-note
      </Link>
      <footer className="legend">
        <small>
          {new Date().getFullYear()} · Made by{' '}
          <a href="https://github.com/regulardesigner/emojinotes">regulardesigner</a>
        </small>
      </footer>
    </>
  );
}
