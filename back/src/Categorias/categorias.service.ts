/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entitie/categorias.entitie';
import { Repository } from 'typeorm';
import { create } from 'domain';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // Servicios
  async getCategory() {
    const categories = await this.categoriaRepository.find();
    if (!categories) {
      throw new NotFoundException('Ocurrió un error al cargar las categorias');
    }
    return categories;
  }

  async getCategoryById(id: string) {
    const category = await this.categoriaRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(
        `Ocurrió un error al cargar la categoria con ID ${id}`,
      );
    }
    return category;
  }

  async createCategory(createCategoryDto): Promise<Categoria> {
    const { name, description } = createCategoryDto;
    const newCategory = this.categoriaRepository.create({ name, description });

    const savedCategory = await this.categoriaRepository.save(newCategory);

    return savedCategory;
  }
}
