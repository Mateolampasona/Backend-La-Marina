// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { MontService } from '../monts/monts.service';

// @Injectable()
// export class TasksService {
//   constructor(private readonly montService: MontService) {}

//   @Cron('0 0 1 * *') // Se ejecuta al inicio de cada mes
//   async handleCron() {
//     const currentDate = new Date();
//     const newMont = {
//       mont: currentDate.toLocaleString('default', { month: 'long' }),
//       year: currentDate.getFullYear(),
//       registeredUsers: 0,
//       sales: 0,
//       cartsCreated: 0,
//       totalRevenue: 0,
//       totalCartsCreated: 0,
//       totalSales: 0,
//       averageOrderValue: 0,
//     };
//     await this.montService.createMont(newMont);
//   }
// }
