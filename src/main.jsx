// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from 'react-oidc-context'
import './index.css'

// 1. Replace these values with YOUR details from Cognito!
console.log('Environment variables:', {
  VITE_COGNITO_DOMAIN: import.meta.env.VITE_COGNITO_DOMAIN,
  VITE_CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI
});



const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_DOMAIN,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid email profile',
  
  // ADD THESE LINES TO BYPASS OIDC DISCOVERY
  metadata: {
    issuer: `${import.meta.env.VITE_COGNITO_DOMAIN.replace('auth', 'cognito-idp')}/us-east-2_yeSsypR7B`,
    authorization_endpoint: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/userInfo`,
    jwks_uri: `${import.meta.env.VITE_COGNITO_DOMAIN.replace('auth', 'cognito-idp')}/us-east-2_yeSsypR7B/.well-known/jwks.json`,
    end_session_endpoint: `${import.meta.env.VITE_COGNITO_DOMAIN}/logout`
  },
  metadataUrl: undefined
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)