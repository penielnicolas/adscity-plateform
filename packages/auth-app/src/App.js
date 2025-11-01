import { useEffect, useState } from 'react';
import { AuthService } from './shared/auth';
import './App.css';

const HOME_URL = process.env.REACT_APP_HOME_URL;
const AUTH_URL = process.env.REACT_APP_AUTH_URL;


function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Rediriger si déjà connecté
    const checkAuth = async () => {
      const user = await AuthService.getCurrentUser();
      if (user) {
        window.location.href = `${HOME_URL}/dashboard`;
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login({ email, password });

      if (result.success) {
        // Redirection vers l'app principale
        window.location.href = `${HOME_URL}/dashboard`;
      }
    } catch (err) {
      setError('Échec de la connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>AdsCity</h1>
          <p>Connexion à votre compte</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email ou téléphone</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-links">
          <a href={`${HOME_URL}`}>Retour à AdsCity</a>
          <a href={`${AUTH_URL}/forgot-password`}>
            Mot de passe oublié?
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
