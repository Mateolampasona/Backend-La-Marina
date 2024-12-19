import { Category } from '../Categories/entity/categories.entity';
import { connectionSource } from '../Config/data-source';

const categories = [
  {
    name: 'Quimicos',
    description: 'Quimicos de limpieza',
  },
  {
    name: 'Papel Linea Hogar',
    description: 'Papel higienico, papel toalla, servilletas, etc',
  },
  {
    name: 'Papel Linea industrial',
    description: 'Papel higienico industrial, obbina de papel, toallas, etc',
  },
  {
    name: 'Bazar',
    description: 'Bazar y utensilios de cocina',
  },
  {
    name: 'Limpieza',
    description: 'Productos de limpieza',
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
