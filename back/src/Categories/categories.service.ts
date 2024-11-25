/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/categories.entity';
import { Repository } from 'typeorm';
import { create } from 'domain';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriaRepository: Repository<Category>,
  ) {}

  async getCategory(): Promise<Category[]> {
    const categories = await this.categoriaRepository.find();
    if (!categories) {
      throw new NotFoundException(
        'An error occurred while trying to get the categories',
      );
    }
    return categories;
  }

  async getCategoryById(categoryId: number): Promise<Category> {
    const category = await this.categoriaRepository.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `An error occurred while trying to get the category with ID ${categoryId}`,
      );
    }
    return category;
  }

  async createCategory(createCategoryDto): Promise<Category> {
    const category = await this.categoriaRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (category) {
      throw new NotFoundException(
        `Category with name ${createCategoryDto.name} already exists`,
      );
    }
    const { name, description } = createCategoryDto;
    const newCategory = this.categoriaRepository.create({ name, description });

    const savedCategory = await this.categoriaRepository.save(newCategory);

    return savedCategory;
  }

  deleteCategory(categoryId: number): string {
    const category = this.categoriaRepository.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `An error occurred while trying to get the category with ID ${categoryId}`,
      );
    }
    this.categoriaRepository.delete(categoryId);
    return `Category with ID ${categoryId} has been deleted`;
  }

  modifyCategory(categoryId: number, createCategoryDto: CreateCategoryDto) {
    const category = this.categoriaRepository.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `An error occurred while trying to get the category with ID ${categoryId}`,
      );
    }
    this.categoriaRepository.update(categoryId, createCategoryDto);
    const categoryUpdated = this.categoriaRepository.findOne({
      where: { categoryId },
    });
    return categoryUpdated;
  }
}
