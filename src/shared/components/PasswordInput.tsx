import { useState } from "react";
import Input from "./Input";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  error,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="password-field">
      <Input
        label={label}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        required
      />

      <button type="button" onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
