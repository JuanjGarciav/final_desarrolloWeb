export default function Navbar({ email, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-dot" />
        GastroOpinión
      </div>
      <div className="navbar-right">
        <span className="navbar-email">{email}</span>
        <button className="btn-logout" onClick={onLogout}>Salir</button>
      </div>
    </nav>
  );
}