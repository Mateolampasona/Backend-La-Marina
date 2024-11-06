/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrderDetailsController } from './ordenes-detalle.controller';
import { OrderDetailsService } from './ordenes-detalle.service';

@Module({
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
})
export class OrdenesDetalleModule {}
