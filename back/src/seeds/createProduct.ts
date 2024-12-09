import { Category } from 'src/Categories/entity/categories.entity';
import { connectionSource } from 'src/Config/data-source';
import { Product } from 'src/Products/entity/productos.entity';

const products = [
  {
    name: 'Product 1',
    description: 'Description for Product 1',
    price: 100,
    imageUrl: 'http://example.com/image1.jpg',
    stock: 10,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 1,
  },
  {
    name: 'Product 2',
    description: 'Description for Product 2',
    price: 200,
    imageUrl: 'http://example.com/image2.jpg',
    stock: 20,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 1,
  },
  {
    name: 'Product 3',
    description: 'Description for Product 3',
    price: 300,
    imageUrl: 'http://example.com/image3.jpg',
    stock: 30,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 2,
  },
  {
    name: 'Product 4',
    description: 'Description for Product 4',
    price: 400,
    imageUrl: 'http://example.com/image4.jpg',
    stock: 40,
    quantitySell: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category_id: 3,
  },
  {
    name: 'Product 5',
    description: 'Description for Product 5',
    price: 500,
    imageUrl: 'http://example.com/image5.jpg',
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
