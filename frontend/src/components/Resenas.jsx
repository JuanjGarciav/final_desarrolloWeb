import { useState, useEffect } from 'react';

const API = 'http://localhost:1702';

function Stars({ value }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star ${n <= value ? 'on' : ''}`}>★</span>
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-picker">
      {[1,2,3,4,5].map(n => (
        <button
          key={n} type="button"
          className={`star-btn ${n <= (hover || value) ? 'on' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >★</button>
      ))}
    </div>
  );
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es-CO', { year:'numeric', month:'short', day:'numeric' });
}

function Modal({ title, onClose, onSubmit, initial }) {
  const [restaurante, setRestaurante] = useState(initial?.restaurante || '');
  const [calificacion, setCalificacion] = useState(initial?.calificacion || 0);
  const [comentario, setComentario] = useState(initial?.comentario || '');
  const [fechaVisita, setFechaVisita] = useState(
    initial?.fechaVisita ? initial.fechaVisita.split('T')[0] : ''
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!calificacion) return setError('Selecciona una calificación.');
    setError(''); setLoading(true);
    try {
      await onSubmit({ restaurante, calificacion, comentario, fechaVisita });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">{title}</h3>
        {error && <div className="auth-error" style={{ marginBottom:'1.25rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Restaurante</label>
            <input
              value={restaurante}
              onChange={e => setRestaurante(e.target.value)}
              placeholder="Nombre del restaurante" required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Calificación</label>
            <StarPicker value={calificacion} onChange={setCalificacion} />
          </div>
          <div className="form-field">
            <label className="form-label">Comentario</label>
            <textarea
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              placeholder="Describe tu experiencia…" required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Fecha de visita</label>
            <input
              type="date" value={fechaVisita}
              onChange={e => setFechaVisita(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary"
            style={{ width:'100%', marginTop:'0.5rem' }} disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar reseña'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Resenas({ token, userId }) {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const fetchResenas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/resenas`, { headers });
      const data = await res.json();
      setResenas(Array.isArray(data) ? data : []);
    } catch {
      setResenas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResenas(); }, []);

  const handleCreate = async (body) => {
    const res = await fetch(`${API}/api/resena`, {
      method: 'POST', headers, body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al crear');
    setShowModal(false);
    fetchResenas();
  };

  const handleUpdate = async (body) => {
    const res = await fetch(`${API}/api/resena/${editing._id}`, {
      method: 'PUT', headers, body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al actualizar');
    setEditing(null);
    fetchResenas();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reseña?')) return;
    await fetch(`${API}/api/resena/${id}`, { method: 'DELETE', headers });
    fetchResenas();
  };

  const visible = resenas.filter(r => {
    if (filter === 'mias') return r.usuario === userId;
    if (filter === 'otras') return r.usuario !== userId;
    return true;
  });

  return (
    <div className="main-layout fade-in">
      <div className="dash-header">
        <div>
          <h2 className="dash-title">Reseñas <span>gastronómicas</span></h2>
          <p className="dash-sub">{resenas.length} reseña{resenas.length !== 1 ? 's' : ''} en total</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nueva reseña</button>
      </div>

      <div className="filters">
        {[['todas','Todas'],['mias','Mis reseñas'],['otras','De otros']].map(([v,l]) => (
          <button key={v} className={`filter-pill ${filter === v ? 'active' : ''}`}
            onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem' }}>
          <span className="loading-dot" />
        </div>
      ) : (
        <div className="cards-grid">
          {visible.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽</div>
              <h3>Sin reseñas aquí</h3>
              <p>{filter === 'mias' ? 'Aún no has escrito ninguna reseña.' : 'No hay reseñas en esta categoría.'}</p>
            </div>
          ) : visible.map(r => {
            const isOwn = r.usuario === userId;
            return (
              <div key={r._id} className={`review-card ${isOwn ? 'own' : ''}`}>
                {isOwn && <div className="own-bar" />}
                <div className="review-top">
                  <span className="review-name">{r.restaurante}</span>
                  <Stars value={r.calificacion} />
                </div>
                <p className="review-comment">{r.comentario}</p>
                <div className="review-footer">
                  <div className="review-meta">
                    <span className="review-author">{isOwn ? 'Tú' : r.usuarioEmail || 'Otro usuario'}</span>
                    <span className="review-date">{formatDate(r.fechaVisita)}</span>
                  </div>
                  {isOwn && (
                    <div className="review-actions">
                      <button className="btn-icon edit" onClick={() => setEditing(r)}>✎</button>
                      <button className="btn-icon del" onClick={() => handleDelete(r._id)}>✕</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title="Nueva reseña" onClose={() => setShowModal(false)} onSubmit={handleCreate} initial={null} />
      )}
      {editing && (
        <Modal title="Editar reseña" onClose={() => setEditing(null)} onSubmit={handleUpdate} initial={editing} />
      )}
    </div>
  );
}