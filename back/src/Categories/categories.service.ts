/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/categories.entity';
import { Repository } from 'typeorm';
import { create } from 'domain';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categorieRepository: Repository<Category>,
  ) {}

  async getCategory(): Promise<Category[]> {
    const categories = await this.categorieRepository.find();
    if (!categories) {
      throw new NotFoundException(
        'An error occurred while trying to get the categories',
      );
    }
    return categories;
  }

  async getCategoryById(categoryId: number): Promise<Category> {
    const category = await this.categorieRepository.findOne({
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
    const category = await this.categorieRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (category) {
      throw new NotFoundException(
        `Category with name ${createCategoryDto.name} already exists`,
      );
    }
    const { name, description } = createCategoryDto;
    const newCategory = this.categorieRepository.create({ name, description });

    const savedCategory = await this.categorieRepository.save(newCategory);

    return savedCategory;
  }

  deleteCategory(categoryId: number): string {
    const category = this.categorieRepository.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `An error occurred while trying to get the category with ID ${categoryId}`,
      );
    }
    this.categorieRepository.delete(categoryId);
    return `Category with ID ${categoryId} has been deleted`;
  }

  async modifyCategory(
    categoryId: number,
    createCategoryDto: CreateCategoryDto,
  ) {
    const category = await this.categorieRepository.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `An error occurred while trying to get the category with ID ${categoryId}`,
      );
    }
    await this.categorieRepository.update(categoryId, createCategoryDto);
    const categoryUpdated = await this.categorieRepository.findOne({
      where: { categoryId },
    });
    return categoryUpdated;
  }
}
