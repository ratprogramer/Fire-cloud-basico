import React, { useState, useEffect } from 'react';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  // Maneja el archivo seleccionado
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Subir la imagen usando fetch
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Imagen subida con éxito');
        setImageUrls((prev) => [...prev, data.imageUrl]);
      } else {
        console.error('Error al subir la imagen:', data);
        alert('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  // Obtener las imágenes ya subidas al iniciar el componente
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/images');
        const data = await response.json();
        setImageUrls(data.result);
        
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Subir Imagen a Firebase y Mostrar Todas</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Imagen</button>
      <h2>Imágenes Subidas</h2>
      <div>
        {imageUrls ? (imageUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Imagen ${index}`} width="100" />
            <p>Imagen {index}</p>
          </div>)
        )): (<div></div>)}
        <img src='https://storage.googleapis.com/url-images-generator.appspot.com/carrito.jpg'></img>
      </div>
    </div>
  );
};

export default App;