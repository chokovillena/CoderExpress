const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  validateProduct(product) {
    const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    const missingFields = requiredFields.filter(field => !product.hasOwnProperty(field));
    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validar el tipo y formato de los campos
    if (typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.thumbnail !== 'string' || typeof product.code !== 'string') {
      console.error('Invalid field type: title, description, thumbnail, and code must be strings');
    }
    if (typeof product.price !== 'number' || product.price <= 0) {
      console.error('Invalid price: price must be a positive number');
    }
    if (typeof product.stock !== 'number' || product.stock < 0) {
      console.error('Invalid stock: stock must be a non-negative number');
    }
  }

  async addProduct(product) {
    this.validateProduct(product);
    try {
      const products = await this.getProductsFromFile();
      const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
      const newProduct = { id, ...product };
      products.push(newProduct);
      await this.saveProductsToFile(products);
      return newProduct;
    } catch (error) {
      console.error('error adding product: ' + error.message);
    }
  }

  async getProducts(limit) {
    try {
      return await this.getProductsFromFile(limit);
    } catch (error) {
      console.error('error getting products: ' + error.message);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProductsFromFile();
      const product = products.find(p => p.id === id);
      if (!product) {
        console.error('Product not found');
      }
      return product;
    } catch (error) {
      console.error('error getting product by ID: ' + error.message);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.getProductsFromFile();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        console.error('Product not found');
      }
      products[index] = { ...products[index], ...updatedProduct };
      await this.saveProductsToFile(products);
      return products[index];
    } catch (error) {
      console.error('error updating product: ' + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      let products = await this.getProductsFromFile();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        console.error('Product not found');
      }
      products.splice(index, 1);
      await this.saveProductsToFile(products);
    } catch (error) {
      console.error('error deleting product: ' + error.message);
    }
  }

  async getProductsFromFile(limit) {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8');
      let products = JSON.parse(data);
      // Si se especifica un límite, devolver solo los primeros 'limit' productos
      if (limit) {
        products = products.slice(0, limit);
      }
  
      return products;    } 
    catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      console.error('error reading file: ' + error.message);
    }
  }

  async saveProductsToFile(products) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
    } catch (error) {
      console.error('error writing file: ' + error.message);
    }
  }

  async deleteAllProducts() {
    try {
      await fs.writeFile(this.path, '[]', (err) => {
        if (err) {
          throw err;
        }
        console.log('All products deleted successfully.');
      });
    } catch (error) {
      console.error('Error deleting products:', error.message);
    }
  }
}

module.exports = ProductManager;


