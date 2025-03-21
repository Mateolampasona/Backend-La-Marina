/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/productos.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { Category } from 'src/Categories/entity/categories.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { User } from 'src/Users/entity/user.entity';
import { Role } from 'src/Auth/enum/roles.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getProducts(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['category_id'],
    });
    if (!products) {
      throw new NotFoundException(
        'An error occurred while trying to get the products',
      );
    }
    return products;
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId: id },
      relations: ['category_id'],
    });
    if (!product) {
      throw new HttpException(
        `Product with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async modifyProduct(
    id: number,
    actualizarProducto: Partial<UpdateProductDto>,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId: id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productRepository.update(id, actualizarProducto);
    const productUpdated = await this.productRepository.findOne({
      where: { productId: id },
      relations: ['category_id'],
    });
    return productUpdated;
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({
      where: { productId: id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productRepository.delete(id);
    return { message: `Producto con ID ${id} eliminado correctamente` };
  }

  async createProduct(
    body: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const { name, description, price, stock, imageUrl, isActive, category_id } =
      body;

    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (user.role !== Role.Admin) {
      throw new HttpException(
        'You do not have permission to create a product',
        HttpStatus.FORBIDDEN,
      );
    }
    // Buscamos la categoría completa en la base de datos
    const categoria = await this.categoryRepository.findOne({
      where: { categoryId: category_id },
    });

    if (!categoria) {
      throw new NotFoundException(`Category with ID ${category_id} not found `);
    }

    const newProduct = this.productRepository.create({
      name,
      description,
      price,
      stock,
      isActive,
      imageUrl,
      category_id: categoria, // Asignamos la categoría completa en lugar de solo el ID
    });

    // Guardamos el producto en la base de datos
    const savedProduct = await this.productRepository.save(newProduct);
    const productWithCategory = await this.productRepository.findOne({
      where: { productId: savedProduct.productId },
      relations: ['category_id'],
    });
    return productWithCategory;
  }
  async addDiscount(productId: number, discount: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId },
    });
    if (discount > 100) {
      throw new HttpException(
        'Discount must be between 0 and 100',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (discount === 0) {
      if (product.originalPrice) {
        product.price = product.originalPrice;
        product.discount = null;
        product.originalPrice = null;
      }
    } else {
      if (product.originalPrice) {
        product.price = product.originalPrice;
      }
      product.originalPrice = product.price;
      product.price = Math.round(
        product.price - product.price * (discount / 100),
      );

      console.log(product.price);
      product.discount = discount;
    }

    await this.productRepository.save(product);
    return product;
  }
}
