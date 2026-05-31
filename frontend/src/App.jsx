import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Resenas from './components/Resenas';

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
    return (
      <div className="loading-screen">
        <span className="loading-dot" />
      </div>
    );
  }

  return (
    <>
      {!token ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <>
          <Navbar email={user?.email} onLogout={handleLogout} />
          <Resenas token={token} userId={user?.id} />
        </>
      )}
    </>
  );
}