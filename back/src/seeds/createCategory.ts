import { Category } from 'src/Categories/entity/categories.entity';
import { connectionSource } from 'src/Config/data-source';

const categories = [
  {
    name: 'Electronics',
    description: 'Devices and gadgets',
  },
  {
    name: 'Clothing',
    description: 'Apparel and accessories',
  },
  {
    name: 'Home & Kitchen',
    description: 'Household items and kitchenware',
  },
  {
    name: 'Books',
    description: 'Printed and digital books',
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sporting goods and outdoor equipment',
  },
];

async function createCategories() {
  const dataSource = await connectionSource.initialize();
  const categoryRepository = dataSource.getRepository(Category);

  try {
    for (const category of categories) {
      const newCAtegory = categoryRepository.create(category);
      await categoryRepository.save(newCAtegory);
    }
    console.log('Categories created successfully');
  } catch (error) {
    console.log('Error creating categories', error);
  } finally {
    await dataSource.destroy();
  }
}

createCategories();
