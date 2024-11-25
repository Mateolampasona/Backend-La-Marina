import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/Categories/entity/categories.entity';
import { OrderDetail } from '../../OrderDetail/entity/orderDetail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'productos' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'text', nullable: false })
  imageUrl: string;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  quantitySell: number;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.products_id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category;

  @ManyToMany(() => OrderDetail)
  @ApiProperty({
    description: 'Ordenes',
  })
  orderDetail: OrderDetail[];
}
