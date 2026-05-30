import { useState } from 'react';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin 
      ? 'http://localhost:1702/api/usuario/login' 
      : 'http://localhost:1702/api/usuario/registrar';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocurrió un error en el servidor');
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      onAuthSuccess(data.usuario, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="card auth-card">
        <div className="auth-header">
          <h1>Reseñas de Restaurantes</h1>
          <p>{isLogin ? 'Inicia sesión para continuar' : 'Crea una cuenta para empezar'}</p>
        </div>

        {error && (
          <div className="alert-banner">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <p>
              ¿No tienes una cuenta?{' '}
              <span onClick={() => { setIsLogin(false); setError(''); }}>Regístrate aquí</span>
            </p>
          ) : (
            <p>
              ¿Ya tienes una cuenta?{' '}
              <span onClick={() => { setIsLogin(true); setError(''); }}>Inicia sesión aquí</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
