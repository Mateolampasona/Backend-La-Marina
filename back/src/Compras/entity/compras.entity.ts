import { User } from 'src/Users/entity/user.entity';
import { Order } from 'src/Orders/entity/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PurchaseDetail } from './purchaseDetail.entity';

export enum OrderStatus {
  ENTRADO = 'Entregado',
  PENDIENTE = 'Pendiente',
  CANCELADO = 'Cancelado',
}

@Entity('compras')
export class Compras {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ManyToOne(() => User, (user) => user.compras, { eager: true })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDIENTE,
  })
  status: string;

  @CreateDateColumn()
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