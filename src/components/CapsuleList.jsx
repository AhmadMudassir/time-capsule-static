import { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import CreateCapsuleForm from './CreateCapsule';
import CapsuleModal from '../Modals/CapsuleModal';
import './CapsuleList.css';

const CapsuleList = () => {
  const auth = useAuth();
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  useEffect(() => {
    fetchCapsules();
  }, [auth.isAuthenticated, auth.user?.access_token]);

  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/capsules`, {
        headers: {
          'Authorization': `Bearer ${auth.user?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch capsules: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setCapsules(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching capsules:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCapsule = async (capsuleId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/capsules/${capsuleId}/open`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.user?.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to open capsule: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update the capsule in the list
    setCapsules(prev => prev.map(capsule => 
      capsule.capsuleId === capsuleId 
        ? { ...capsule, status: 'OPENED' } 
        : capsule
    ));
    
    // Show the modal with the opened capsule
    setSelectedCapsule(result);
  } catch (err) {
    setError(err.message);
    console.error('Error opening capsule:', err);
  }
};

// Update the viewCapsule function to reopen already opened capsules
const viewCapsule = async (capsule) => {
  if (capsule.status === 'OPENED') {
    // For already opened capsules, call the open API again to get the message
    try {
      const response = await fetch(`https://0gdifq23yd.execute-api.us-east-2.amazonaws.com/Prod/capsules/${capsule.capsuleId}/open`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.user?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to reopen capsule: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setSelectedCapsule(result);
    } catch (err) {
      setError(err.message);
      console.error('Error reopening capsule:', err);
    }
  }
};

  const handleCapsuleCreated = (newCapsule) => {
    // Refresh the list
    fetchCapsules();
    setShowCreateForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading your capsules...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="capsule-list">
      <div className="capsule-list-header">
        <h2>Your Time Capsules</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          + Create New Capsule
        </button>
      </div>
      
      {showCreateForm ? (
        <CreateCapsuleForm 
          onCapsuleCreated={handleCapsuleCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : capsules.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any time capsules yet.</p>
          <p>Create your first one to get started!</p>
        </div>
      ) : (
        <div className="capsules-grid">
          {capsules.map(capsule => (
            <div key={capsule.capsuleId} className="capsule-card">
              <h3>{capsule.title}</h3>
              <p className="created-date">Created: {formatDate(capsule.createdDate)}</p>
              <p className={`status ${capsule.status.toLowerCase()}`}>
                Status: {capsule.status}
              </p>
              
              {capsule.deliveryDate && (
                <p className="delivery-date">
                  Scheduled for: {formatDate(capsule.deliveryDate)}
                </p>
              )}
              
              <div className="capsule-actions">
                {capsule.status === 'ACTIVE' && (
                  <button 
                    className="btn btn-open"
                    onClick={() => openCapsule(capsule.capsuleId)}
                  >
                    Open Now
                  </button>
                )}
                
                {capsule.status === 'OPENED' && (
                  <button 
                    className="btn btn-view"
                    onClick={() => viewCapsule(capsule)}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedCapsule && (
        <CapsuleModal 
          capsule={selectedCapsule}
          onClose={() => setSelectedCapsule(null)}
        />
      )}
    </div>
  );
};

export default CapsuleList;