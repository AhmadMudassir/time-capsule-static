import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import './CreateCapsule.css';

const CreateCapsuleForm = ({ onCapsuleCreated, onCancel }) => {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    deliveryDate: '',
    recipientEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Prepare the data to send
    const dataToSend = {
      title: formData.title,
      message: formData.message,
      recipientEmail: formData.recipientEmail || auth.user?.profile.email // Use user's email if not provided
    };

    // Only add deliveryDate if provided and convert to proper format
    if (formData.deliveryDate) {
      // Convert datetime-local format to ISO string with timezone
      const localDate = new Date(formData.deliveryDate);
      dataToSend.deliveryDate = localDate.toISOString();
    }

    console.log('Sending data:', dataToSend);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/capsules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.user?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create capsule: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    onCapsuleCreated(result);
    
    // Reset form
    setFormData({
      title: '',
      message: '',
      deliveryDate: '',
      recipientEmail: ''
    });
  } catch (err) {
    setError(err.message);
    console.error('Create capsule error:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="create-capsule-form">
      <h3>Create New Time Capsule</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Give your capsule a title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder="What message do you want to preserve?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliveryDate">Schedule Delivery (Optional)</label>
          <input
            type="datetime-local"
            id="deliveryDate"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleInputChange}
            placeholder="When should this capsule be delivered?"
          />
          <small>Leave empty for immediate delivery</small>
        </div>

        <div className="form-group">
          <label htmlFor="recipientEmail">Recipient Email (Optional)</label>
          <input
            type="email"
            id="recipientEmail"
            name="recipientEmail"
            value={formData.recipientEmail}
            onChange={handleInputChange}
            placeholder="Who should receive this capsule? (default: your email)"
          />
        </div>

        {error && (
            <div className="error-message">
                <strong>Error:</strong> {error}
                <br />
                <small>Please check your delivery date is in the future</small>
            </div>
        )}

        <div className="form-buttons">
          <button 
            type="button" 
            className="btn btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Time Capsule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCapsuleForm;