import { User } from 'src/Users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { OrderDetail } from '../../OrderDetail/entity/orderDetail.entity';
import { Compras } from 'src/Compras/entity/compras.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @OneToOne(() => User, (user) => user.order)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @Column()
  status: string = 'pending';

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_detail_id' })
  orderDetails: OrderDetail[];

  @Column()
  totalOrder: number = 0;


}
