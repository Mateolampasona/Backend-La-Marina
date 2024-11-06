/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { OrderDetailsService } from './ordenes-detalle.service';

@Controller('ordenesDetalle')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  // Rutas
}
