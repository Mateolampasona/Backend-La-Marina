import { Category } from '../Categories/entity/categories.entity';
import { connectionSource } from '../config/data-source';
import { Product } from '../Products/entity/productos.entity';

const products = [
  {
    name: 'Lavandina CMC 5 litros',
    description: 'Bidon de lavandina triple accion 5 litros',
    price: 3050,
    imageUrl:
      'https://res.cloudinary.com/dcaqkyvfu/image/upload/v1734562101/txgcjkdhtnhylizpld1r.png',
    stock: 100,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 1,
  },
  {
    name: 'Papel higienico campanita Soft 30MT x4 und',
    description: 'Papel higienico campanita Soft 30MT x 4 und',
    price: 1350,
    imageUrl:
      'https://res.cloudinary.com/dcaqkyvfu/image/upload/v1734562165/j6bqx0imllqyalodlqgu.jpg',
    stock: 20,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 2,
  },
  {
    name: 'Bobina papel Campanita 400MT x2 und',
    description: 'Bobina de papel campanita 400MT x 2 und',
    price: 27500,
    imageUrl:
      'https://res.cloudinary.com/dcaqkyvfu/image/upload/v1734562195/soaxv2ipu4th53zr3yi9.jpg',
    stock: 30,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 3,
  },
  {
    name: 'Bifera enlozada plegable 20cm',
    description: 'Bifera enlozada plegable 20cm',
    price: 15600,
    imageUrl:
      'https://res.cloudinary.com/dcaqkyvfu/image/upload/v1734562286/ogk5umg2axrmotybtbld.jpg',
    stock: 40,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 3,
  },
  {
    name: 'Escobilla para inodoro con soporte',
    description: 'Escobilla para inodoro con soporte',
    price: 500,
    imageUrl:
      'https://res.cloudinary.com/dcaqkyvfu/image/upload/v1734562322/gavjkwcunemvtimz5cxa.jpg',
    stock: 50,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 4,
  },
];

async function createProduct() {
  const dataSource = await connectionSource.initialize();
  const productRepository = dataSource.getRepository(Product);
  const categoryRepository = dataSource.getRepository(Category);
  try {
    for (const product of products) {
      const category = await categoryRepository.findOneBy({
        categoryId: product.category_id,
      });
      if (!category) {
        console.log(`Category with id ${product.category_id} not found`);
        continue;
      }
      const newProduct = productRepository.create({
        ...product,
        category_id: category,
      });
      await productRepository.save(newProduct);
    }
    console.log('Products created successfully');
  } catch (error) {
    console.log('Error creating products', error);
  } finally {
    await dataSource.destroy();
  }
}

createProduct();
