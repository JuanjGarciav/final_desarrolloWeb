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
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en el servidor');
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
      onAuthSuccess(data.usuario, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setIsLogin(!isLogin); setError(''); };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-glow" />
        <div className="auth-left-glow2" />
        <div className="auth-divider" />
        <p className="auth-left-logo">Gastro tour - Final Desarrollo Web</p>
        <div className="auth-left-bottom">
          <h1 className="auth-big-title">
            Sabor<br/>
            <span className="amber">que</span><br/>
            <span className="outline">emociona.</span>
          </h1>
          <p className="auth-desc">
            Registra tus experiencias gastronómicas, comparte reseñas
            y descubre los favoritos de la comunidad.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box fade-in">
          <h2 className="auth-form-title">{isLogin ? 'Bienvenido' : 'Únete'}</h2>
          <p className="auth-form-sub">
            {isLogin ? 'Ingresa tus credenciales para continuar.' : 'Crea tu cuenta en segundos.'}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com" required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Contraseña</label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
              />
            </div>
            <button
              type="submit" className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Un momento…' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin
              ? <p>¿No tienes cuenta? <span onClick={switchMode}>Regístrate aquí</span></p>
              : <p>¿Ya tienes cuenta? <span onClick={switchMode}>Inicia sesión</span></p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}