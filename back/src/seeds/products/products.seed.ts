import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from 'src/Categorias/entitie/categorias.entitie';
import { Producto } from 'src/Productos/entitie/productos.entity';
import { Repository } from 'typeorm';
import { productosMock } from './products-mock';

@Injectable()
export class ProductSeed {
  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoryRepository: Repository<Categoria>,
  ) {}
  async findCategoryByName(category: string) {
    const foundCategory = await this.categoryRepository.findOne({
      where: { name: category },
    });
    if (!foundCategory) {
      throw new Error(`Category ${category} not found`);
    }
    return foundCategory;
  }

  async seed() {
    const existingProductName = (await this.productRepository.find()).map(
      (product) => product.name,
    );
    for (const productData of productosMock) {
      if (!existingProductName.includes(productData.name)) {
        const product = new Producto();
        product.name = productData.name;
        product.categoria = productData.categoria;
        product.description = productData.description;
        product.fechaActualización = productData.fechaActualización;
        product.fechaCreación = productData.fechaCreación;
        product.imageUrl = productData.imageUrl;
        product.price = productData.price;
        product.stock = productData.stock;
        await this.productRepository.save(product);
      }
    }
  }
}
