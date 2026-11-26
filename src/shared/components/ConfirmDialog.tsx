import Modal from "./Modal";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  message,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal open={open} title="Confirm action" onClose={onClose}>
      <p>{message}</p>
      <button onClick={onClose}>Cancel</button>
      <button onClick={onConfirm}>Confirm</button>
    </Modal>
  );
}
