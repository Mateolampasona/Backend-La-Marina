import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mont } from './entity/mont.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/Users/users.services';
import { OrderService } from 'src/Orders/ordenes.service';
import { ComprasService } from 'src/Compras/compras.service';

@Injectable()
export class MontService {
  constructor(
    @InjectRepository(Mont) private readonly montRepository: Repository<Mont>,
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
    private readonly comprasService: ComprasService,
  ) {}

  async createMont(mont: string): Promise<Mont> {
    const newMont = await this.montRepository.create({
      mont: mont,
      year: new Date().getFullYear(),
      totalUsers: 0,
      totalSales: 0,
      totalCarts: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
    });
    this.montRepository.save(newMont);
    if (!newMont) {
      throw new Error('Error creating mont');
    }
    return newMont;
  }

  async getCurrentMont(): Promise<Mont> {
    const currenDate = new Date();
    const currentMont = await this.montRepository.findOne({
      where: {
        mont: currenDate.toLocaleString('default', { month: 'long' }),
        year: currenDate.getFullYear(),
      },
    });
    if (!currentMont) {
      throw new Error('Error getting current mont');
    }
    return currentMont;
  }

  async updateCurrentMontStatistics() {
    const currentMont = await this.getCurrentMont();
    console.log(currentMont);
    const montIndex = await this.getMonthIndex(currentMont.mont);
    const users = await this.userService.getUserByMont(
      montIndex,
      currentMont.year,
    );
    console.log('users', users);
    const carts = await this.orderService.getOrdersByMont(
      montIndex,
      currentMont.year,
    );
    console.log('carts', carts);
    const sales = await this.comprasService.getSalesByMont(
      montIndex,
      currentMont.year,
    );
    console.log('sales', sales);

    currentMont.totalUsers = users.length;
    currentMont.totalSales = sales.length;
    currentMont.totalCarts = carts.length;
    currentMont.totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);

    await this.montRepository.save(currentMont);
    return currentMont;
  }

  async getMonthIndex(month: string): Promise<number> {
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    return months.indexOf(month.toLowerCase());
  }
}
