import { User } from 'src/Users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PurchaseDetail } from './purchaseDetail.entity';
import { Exclude } from 'class-transformer';
import { Discount } from 'src/discounts/entity/discount.entity';

export enum OrderStatus {
  ENTRADO = 'Entregado',
  PENDIENTE = 'Pendiente',
  CANCELADO = 'Cancelado',
}

@Entity('compras')
export class Compras {
  @PrimaryGeneratedColumn('uuid')
  compraId: string;

  @ManyToOne(() => User, (user) => user.compras, { eager: true })
  @Exclude()
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDIENTE,
  })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'purchase_date',
  })
  purchaseDate: Date;

  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string;

  @Column({ nullable: true })
  payment_preference_id: string;

  @OneToMany(() => PurchaseDetail, (purchaseDetail) => purchaseDetail.compra)
  purchaseDetails: PurchaseDetail[];

  @Column()
  total: number;
}
