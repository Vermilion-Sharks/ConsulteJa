export function Alert({ message }) {
  if (!message) return null;
  
  return (
    <div className="google-alert">
      {message}
    </div>
  );
}