import { useModal } from "../../context/Modal";

export default function FeatureCommingSoon() {
  const { closeModal } = useModal();
  return (
    <div>
      <h2 className="modal-title">Coming Soon</h2>
      <p className="modal-description">
        This feature is currently under development. Stay tuned for exciting
        updates!
      </p>
      <button style={{ marginTop: 20 }} onClick={closeModal}>
        OK, Got It
      </button>
    </div>
  );
}
