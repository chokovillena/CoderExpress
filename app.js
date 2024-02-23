const express = require('express');
const ProductManager = require('./ProductManager'); // Importar la clase ProductManager
const app = express();
const port = 8080;

// Crear una instancia de ProductManager con la ruta al archivo de productos
const productManager = new ProductManager('products.json');

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    // Obtener el parámetro de límite de la consulta
    const limit = parseInt(req.query.limit);
    console.log(limit)
    // Obtener todos los productos o los primeros 'limit' productos
    const products = await productManager.getProducts(limit);

    // Enviar la respuesta con los productos
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(products, null, 2)); // 2 espacios de sangría para una mejor legibilidad
  } catch (error) {
    // En caso de error, enviar un mensaje de error en la respuesta
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); // Obtener el ID del producto de los parámetros de la URL
    
    // Obtener el producto por su ID
    const product = await productManager.getProductById(productId);

    // Verificar si se encontró el producto
    if (!product) {
      // Si el producto no existe, enviar un mensaje de error en la respuesta
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(product, null, 2)); // 2 espacios de sangría para una mejor legibilidad
  } catch (error) {
    // En caso de error, enviar un mensaje de error en la respuesta
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
