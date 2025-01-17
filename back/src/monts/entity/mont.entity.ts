import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('monts')
export class Mont {
  @PrimaryGeneratedColumn()
  montId: number;

  @Column()
  mont: string;

  @Column()
  year: number;

  @Column()
  totalUsers: number;

  @Column()
  totalSales: number;

  @Column()
  totalCarts: number;

  @Column()
  averageOrderValue: number;

  @Column()
  totalRevenue: number;
}
