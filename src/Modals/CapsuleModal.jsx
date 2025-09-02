import './CapsuleModal.css';

const CapsuleModal = ({ capsule, onClose }) => {
  if (!capsule) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        
        <h2>{capsule.title}</h2>
        
        <div className="modal-details">
          <p><strong>Created:</strong> {formatDate(capsule.createdDate)}</p>
          {capsule.deliveryDate && (
            <p><strong>Originally Scheduled For:</strong> {formatDate(capsule.deliveryDate)}</p>
          )}
          <p><strong>Status:</strong> <span className="status opened">OPENED</span></p>
          {capsule.recipientEmail && (
            <p><strong>Recipient:</strong> {capsule.recipientEmail}</p>
          )}
        </div>
        
        <div className="message-container">
          <h3>Your Message:</h3>
          <div className="message-content">
            {capsule.decryptedMessage || "Message content not available"}
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CapsuleModal;