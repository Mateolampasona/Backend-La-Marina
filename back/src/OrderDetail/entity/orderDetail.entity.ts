import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/Orders/entity/order.entity';
import { Product } from 'src/Products/entity/productos.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'orderDetail' })
export class OrderDetail {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  @IsNotEmpty()
  quantity: number;


}
