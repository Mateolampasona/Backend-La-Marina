import { User } from 'src/Users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { PurchaseDetail } from './purchaseDetail.entity';
import { Exclude } from 'class-transformer';
import { Discount } from 'src/discounts/entity/discount.entity';
import { Address } from 'src/addresses/entity/addresses.entity';

export enum PaymentStatus {
  PAGADO = 'Pagado',
  PENDIENTE = 'Pendiente de pago',
  CANCELADO = 'Cancelado',
}
export enum ShipingStatus {
  PENDIENTE = 'Pendiente',
  ENVIADO = 'Enviado',
  ENTREGADO = 'Entregado',
}

@Entity('compras')
export class Compras {
  @PrimaryGeneratedColumn('uuid')
  purchaseId: string;

  @ManyToOne(() => User, (user) => user.compras, { eager: true })
  @Exclude()
  user: User;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDIENTE,
  })
  paymentStatus: string;

  @Column({
    type: 'enum',
    enum: ShipingStatus,
    default: ShipingStatus.PENDIENTE,
  })
  shippingStatus: string;

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

  @Column({ type: 'boolean', default: false })
  shipment: boolean;

  @OneToOne(() => Address, { nullable: true })
  @JoinColumn()
  address: Address;

  @Column()
  total: number;

  @Column({
    nullable: false,
  })
  isShipment: boolean;
}
