import { Categoria } from 'src/Categorias/entitie/categorias.entitie';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'fecha_creación',
  })
  fechaCreación: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'fecha_actualización',
  })
  fechaActualización: Date;

  //   Relación con la categoría
  @ManyToOne(
    () => {
      return Categoria;
    },
    (categoria) => categoria.productos,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  //   Campo URL para la imagen del producto
  @Column({
    type: 'text',
    nullable: true,
  })
  imageUrl: string;
}
