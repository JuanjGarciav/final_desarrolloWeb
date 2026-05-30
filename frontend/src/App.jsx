import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Navbar from './components/Navbar';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('usuario');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setInitialized(true);
  }, []);

  const handleAuthSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  };

  if (!initialized) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Cargando aplicación...</div>;
  }

  return (
    <div>
      {!token ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <>
          <Navbar email={user?.email} onLogout={handleLogout} />
          <div className="main-layout animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>Bienvenido a GastroOpinión</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Has iniciado sesión con éxito en el Módulo de Autenticación (Módulo A). 
                El Módulo B (CRUD de Reseñas de Restaurantes) será integrado por tu compañero.
              </p>
              <div style={{ display: 'inline-flex', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                Módulo A Activo • Listo para Integración
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
