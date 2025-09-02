import { useAuth } from "react-oidc-context";
import CapsuleList from './components/CapsuleList';
import './App.css';

function App() {
  const auth = useAuth();

const handleLogout = () => {
  auth.removeUser();
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const logoutUri = import.meta.env.VITE_LOGOUT_REDIRECT_URI;
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

  if (auth.isLoading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading Time Capsule...</p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="app-container">
        <div className="error-container">
          <h1>Time Capsule</h1>
          <div className="error-message">
            <h3>Oops! Something went wrong</h3>
            <p>{auth.error.message}</p>
          </div>
          <button className="btn btn-primary" onClick={() => auth.signinRedirect()}>
            Try Sign In Again
          </button>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="app-container">
        {/* Header - Removed sticky positioning */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="logo">
              <span className="logo-icon">⏳</span>
              Time Capsule
            </h1>
            <div className="header-actions">
              <span className="user-welcome">Welcome, {auth.user?.profile.email}</span>
              {/* Removed Switch Account button */}
              <button className="btn btn-logout" onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <CapsuleList />
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>&copy; 2025 Time Capsule. Preserve your memories for the future.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="landing-page">
        <header className="landing-header">
          <h1 className="main-logo">
            <span className="logo-icon">⏳</span>
            Time Capsule
          </h1>
        </header>
        
        <main className="landing-main">
          <div className="hero-section">
            <h2>Preserve Your Memories for the Future</h2>
            <p>Create digital time capsules to store messages, photos, and memories for yourself or loved ones to discover later.</p>
            
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <h3>Secure Storage</h3>
                <p>Encrypted messages protected until delivery</p>
              </div>
              <div className="feature">
                <span className="feature-icon">⏰</span>
                <h3>Scheduled Delivery</h3>
                <p>Set future dates for automatic opening</p>
              </div>
              <div className="feature">
                <span className="feature-icon">📧</span>
                <h3>Email Notifications</h3>
                <p>Get alerted when capsules are ready</p>
              </div>
            </div>

            <button className="btn btn-large btn-primary" onClick={() => auth.signinRedirect()}>
              🔐 Get Started - Sign In / Sign Up
            </button>
          </div>
        </main>

        <footer className="landing-footer">
          <p>Secure authentication powered by AWS Cognito</p>
        </footer>
      </div>
    </div>
  );
}

export default App;