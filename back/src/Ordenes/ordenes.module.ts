/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';

@Module({
  providers: [OrdenesService],
  controllers: [OrdenesController],
})
export class OrdenesModule {}
