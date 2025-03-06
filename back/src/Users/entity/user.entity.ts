import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/addresses/entity/addresses.entity';
import { Role } from 'src/Auth/enum/roles.enum';
import { Compras } from 'src/Compras/entity/compras.entity';
import { Order } from 'src/Orders/entity/order.entity';
import { Product } from 'src/Products/entity/productos.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Nombre del usuario', example: 'John Doe' })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'user@example.com',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'local',
  })
  @ApiProperty({ description: 'Proveedor de autenticación', example: 'local' })
  authProvider: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-11-25T19:55:37.000Z',
  })
  createdAt: Date;

  @OneToOne(() => Order, (order) => order.user)
  @ApiProperty({
    description: 'Orden del usuario',
    type: () => Order,
  })
  order: Order;

  @Column({ type: 'enum', enum: Role, default: 'user' })
  role: Role;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @OneToMany(() => Compras, (compras) => compras.user)
  compras: Compras[];

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable({
    name: 'user_favorites',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'productId',
    },
  })
  favorites: Product[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
