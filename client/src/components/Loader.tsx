export function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="loader" role="status">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
