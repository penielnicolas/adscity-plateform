import { useEffect, useState } from 'react';
import { AuthService } from './shared/auth';
import './App.css';

const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const ACCOUNT_URL = process.env.REACT_APP_ACCOUNT_URL;
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    checkAuthentication();
    loadUserAds();
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

  const loadUserAds = async () => {
    try {
      const response = await fetch( `${API_URL}/api/ads`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAds(data.ads);
      }
    } catch (error) {
      console.error('Failed to load ads:', error);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="main-app">
      <header className="app-header">
        <div className="header-content">
          <h1>AdsCity Platform</h1>
          <nav className="main-nav">
            <a href="/dashboard">Tableau de bord</a>
            <a href="/ads">Mes annonces</a>
            <a href={`${ACCOUNT_URL}/profile`}>
              Mon compte
            </a>
            <button onClick={handleLogout} className="logout-btn">
              Déconnexion
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="welcome-section">
          <h2>Bienvenue, {user?.name}!</h2>
          <p>Gérez vos campagnes publicitaires en un seul endroit.</p>
        </div>

        <div className="dashboard-grid">
          <div className="stats-card">
            <h3>Annonces actives</h3>
            <div className="stat-number">{ads.length}</div>
          </div>

          <div className="stats-card">
            <h3>Performance</h3>
            <div className="stat-number">98%</div>
          </div>

          <div className="stats-card">
            <h3>Budget</h3>
            <div className="stat-number">€2,450</div>
          </div>
        </div>

        <div className="recent-ads">
          <h3>Annonces récentes</h3>
          {ads.length > 0 ? (
            <div className="ads-list">
              {ads.map(ad => (
                <div key={ad.id} className="ad-item">
                  <h4>{ad.title}</h4>
                  <span className="ad-category">{ad.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucune annonce pour le moment.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
