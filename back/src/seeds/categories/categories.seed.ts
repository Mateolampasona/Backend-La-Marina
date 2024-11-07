/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from 'src/Categorias/entitie/categorias.entitie';
import { In, Repository } from 'typeorm';
import { categoriasMock } from './categories-mock';

@Injectable()
export class CategoriesSeed {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoryRepository: Repository<Categoria>,
  ) {}

  async seed() {
    // Obtener los nombres de las categorías del mock
    const categoryNames = categoriasMock.map((category) => category.name);

    // Obtener todas las categorías existentes en la base de datos por nombre
    const existingCategories = await this.categoryRepository.find({
      where: { name: In(categoryNames) },
    });

    // Usar for... of para asegurar la ejecución secuencial de las operaciones asíncronas
    for (const category of categoriasMock) {
      // Verificar si la categoría ya existe por su nombre
      if (
        !existingCategories.some(
          (existingCategory) => existingCategory.name === category.name,
        )
      ) {
        const newCategory = new Categoria();
        newCategory.name = category.name;
        newCategory.description = category.description; // Asegúrate de incluir otros campos como description
        newCategory.productos = category.productos; // Incluye productos si es necesario
        await this.categoryRepository.save(newCategory);
      }
    }
  }
}
