import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/Auth/enum/roles.enum';
import { Order } from 'src/Orders/entity/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
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
}
