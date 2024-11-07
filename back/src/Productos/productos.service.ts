/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entitie/productos.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
  ) {}

  //   Servicios
  async getProducts() {
    const productos = await this.productRepository.find();
    if (!productos) {
      throw new NotFoundException('Ocurrió un error al cargar los productos');
    }
    return productos;
  }

  async getProductById(id: string) {
    const producto = await this.productRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID: ${id} no encontrado`);
    }
    return producto;
  }

  async modifyProduct(
    id: string,
    actualizarProducto: Partial<UpdateProductDto>,
  ) {
    const producto = await this.productRepository.preload({
      id,
      ...actualizarProducto,
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return this.productRepository.save(producto);
  }

  async deleteProduct(id: string) {
    const producto = await this.getProductById(id);
    await this.productRepository.delete(id);
    return `Producto con ID ${id} eliminado correctamente`;
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { name, description, price, stock, imageUrl, isActive } =
      createProductDto;
    const newProduct = this.productRepository.create({
      name,
      description,
      price,
      stock,
      isActive,
      imageUrl,
    });
    await this.productRepository.save(newProduct);
    return newProduct;
  }
}
