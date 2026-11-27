import { useEffect } from "react";

interface Props {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(onClose, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast" role="status">
      {message}
      <button onClick={onClose}>×</button>
    </div>
  );
}
