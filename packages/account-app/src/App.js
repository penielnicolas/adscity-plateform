import { useEffect, useState } from 'react';
import { AuthService } from '../src/shared/auth';
import './App.css';

const HOME_URL = process.env.REACT_APP_HOME_URL;
const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
    loadUserProfile();
  }, []);

  const checkAuthentication = async () => {
    const userData = await AuthService.getCurrentUser();
    if (!userData) {
      window.location.href = `${AUTH_URL}/login`;
      return;
    }
    setUser(userData.user);
    setLoading(false);
  };

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="account-app">
      <header className="account-header">
        <div className="header-content">
          <h1>Mon Compte AdsCity</h1>
          <nav className="account-nav">
            <a href={`${HOME_URL}`}>
              Retour à AdsCity
            </a>
            <button onClick={AuthService.logout} className="logout-btn">
              Déconnexion
            </button>
          </nav>
        </div>
      </header>

      <main className="account-main">
        <div className="profile-section">
          <h2>Profil Utilisateur</h2>

          {profile && (
            <div className="profile-card">
              <div className="profile-field">
                <label>Nom complet</label>
                <div className="field-value">{profile.name}</div>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <div className="field-value">{profile.email}</div>
              </div>

              <div className="profile-field">
                <label>Rôle</label>
                <div className="field-value">
                  <span className="role-badge">{profile.role}</span>
                </div>
              </div>

              <div className="profile-field">
                <label>ID Utilisateur</label>
                <div className="field-value">{profile.id}</div>
              </div>
            </div>
          )}

          <div className="account-actions">
            <h3>Actions du compte</h3>
            <div className="actions-grid">
              <button className="action-btn">
                Modifier le profil
              </button>
              <button className="action-btn">
                Changer le mot de passe
              </button>
              <button className="action-btn">
                Paramètres de notification
              </button>
              <button className="action-btn">
                Historique d'activité
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
