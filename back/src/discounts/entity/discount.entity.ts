import { ApiProperty } from '@nestjs/swagger';
import { Compras } from 'src/Compras/entity/compras.entity';
import { Order } from 'src/Orders/entity/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'discounts' })
export class Discount {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID del descuento', example: 1 })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  @ApiProperty({
    description: 'Nombre del descuento',
    example: 'Descuento de Navidad',
  })
  name: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  maxUses: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  @ApiProperty({ description: 'Porcentaje de descuento', example: 10 })
  percentage: number;

  @Column({
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: 'Fecha de inicio del descuento',
    example: '2021-12-01',
  })
  startDate: Date;

  @Column({
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: 'Fecha de fin del descuento',
    example: '2021-12-31',
  })
  endDate: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  @ApiProperty({ description: 'Código de descuento', example: 'NAVIDAD2021' })
  discountCode: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  @ApiProperty({ description: 'Estado del descuento', example: true })
  isActive: boolean;

  @Column({ nullable: true })
  uses: number;

  @OneToMany(() => Order, (order) => order.discount)
  orders: Order[];
}
