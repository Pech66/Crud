import React, { useEffect, useState } from 'react';

const Nombres = () => {
  const [nombre, setNombre] = useState('');
  const [lista, setLista] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  const limpiarTexto = (str) => {
    return str
      .replace(/[<>]/g, '')
      .replace(/&/g, '');
  };

  const contieneContenidoPeligroso = (str) => {
    const lower = str.toLowerCase();
    const patrones = [
      /<\s*script/,
      /<\s*\/\s*script/,
      /javascript\s*:/,
      /on\w+\s*=/,
      /<\s*img/,
      /<\s*iframe/,
    ];
    return patrones.some((patron) => patron.test(lower));
  };

  const cargarLista = async () => {
    if (!API_BASE) {
      setError('Falta configurar VITE_API_URL.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/crud`);
      if (!response.ok) {
        throw new Error('Error al cargar datos.');
      }
      const data = await response.json();
      setLista(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('No se pudo cargar la lista.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLista();
  }, []);

  const enviarNombre = async () => {
    if (!API_BASE) {
      alert('Falta configurar VITE_API_URL.');
      return;
    }

    const nombreLimpio = limpiarTexto(nombre.trim());
    const nombreFinal = nombreLimpio.slice(0, 25);

    const regexSoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;

    if (!nombreFinal) {
      alert('El nombre es obligatorio.');
      return;
    }

    if (contieneContenidoPeligroso(nombre)) {
      alert('Contenido no permitido.');
      return;
    }

    if (!regexSoloLetras.test(nombreFinal)) {
      alert('¡Error! No se permiten scripts ni caracteres especiales.');
      return;
    }

    if (nombreFinal.length < 5) {
      alert('Debe tener al menos 5 caracteres.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const url = editingId ? `${API_BASE}/crud/${editingId}` : `${API_BASE}/crud`;
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: nombreFinal }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar.');
      }

      setNombre('');
      setEditingId(null);
      await cargarLista();
    } catch (err) {
      setError('No se pudo guardar el nombre.');
    } finally {
      setSubmitting(false);
    }
  };

  const iniciarEdicion = (item) => {
    setNombre(item?.texto || '');
    setEditingId(item?.id ?? null);
  };

  const eliminarNombre = async (id) => {
    if (!API_BASE) {
      alert('Falta configurar VITE_API_URL.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/crud/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar.');
      }

      await cargarLista();
    } catch (err) {
      setError('No se pudo eliminar el nombre.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="title-block">
          <p className="eyebrow">Mini CRM</p>
          <h1>Gestor de nombres</h1>
          <p className="subtitle">
            Agrega, valida y organiza tu lista en segundos.
          </p>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{lista.length}</span>
          </div>
        </div>
      </header>

      {error ? <div className="alert">{error}</div> : null}

      <section className="form-section">
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              maxLength="25"
              placeholder="Escribe un nombre..."
              value={nombre}
              onChange={(e) => {
                const value = e.target.value.replace(/[<>]/g, '');
                setNombre(value);
              }}
              pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+"
            />
          </div>
          <button
            className="btn-primary"
            onClick={enviarNombre}
            disabled={submitting}
          >
            {editingId ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
        <p className="helper">
          Solo letras y espacios. Minimo 5 caracteres. Maximo 25.
        </p>
      </section>

      <section className="list-section">
        <div className="section-header">
          <h3>Lista de nombres</h3>
          <span className="pill">{lista.length} items</span>
        </div>
        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : lista.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">+</div>
            <p>Aun no hay nombres. Agrega el primero para comenzar.</p>
          </div>
        ) : (
          <ul className="name-list">
            {lista.map((item) => (
              <li key={item.id ?? item.texto}>
                <span className="name-text">{item?.texto}</span>
                <div className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => iniciarEdicion(item)}
                    disabled={submitting}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => eliminarNombre(item.id)}
                    disabled={submitting}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Nombres;
