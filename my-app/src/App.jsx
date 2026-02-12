import React, { useState } from 'react';

const App = () => {
  const [nombre, setNombre] = useState("");

  const limpiarTexto = (str) => {
    return str.replace(/[<>]/g, ""); 
  };

  const agregarNombre = () => {
    const nombreLimpio = limpiarTexto(nombre.trim());

    const regexSoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;

    if (!nombreLimpio) {
      alert("El nombre es obligatorio.");
      return;
    }

    if (!regexSoloLetras.test(nombreLimpio)) {
      alert("¡Error! No se permiten scripts ni caracteres especiales.");
      return;
    }

    if (nombreLimpio.length < 5) {
      alert("Debe tener al menos 5 caracteres.");
      return;
    }

    setLista([...lista, nombreLimpio]);
    setNombre(""); 
  };

  return (
    <div className="container">
      <header>
        <h1>Crud sencillo</h1>
      </header>

      <section className="form-section">
        <div className="input-group">
          <label htmlFor="nombre">Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            maxLength="50" 
            placeholder="Escribe un nombre..." 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            // Validación nativa del navegador
            pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+"
          />
          <button className="btn-primary" onClick={agregarNombre}>
            Agregar
          </button>
        </div>
      </section>

      <section className="list-section">
        <h3>Lista de nombres</h3>
        <ul>
            <li >
              <div className="actions">
                <button className="btn-edit">Editar</button>
                <button className="btn-delete">Eliminar</button>
              </div>
            </li>
        </ul>
      </section>
    </div>
  );
};

export default App;
