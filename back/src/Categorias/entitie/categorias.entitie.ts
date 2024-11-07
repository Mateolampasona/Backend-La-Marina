import { Producto } from 'src/Productos/entitie/productos.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    length: 100,
    nullable: true,
  })
  description: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
