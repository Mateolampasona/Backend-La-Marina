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
import { User } from 'src/Users/entity/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: true })
  discount?: number;

  @Column({ type: 'int', nullable: true })
  originalPrice?: number;

  @Column({ type: 'text', nullable: true })
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
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category;

  @ManyToMany(() => OrderDetail)
  @ApiProperty({
    description: 'Ordenes',
  })
  orderDetail: OrderDetail[];

  @ManyToMany(() => User, (user) => user.favorites)
  users: User[];
}
