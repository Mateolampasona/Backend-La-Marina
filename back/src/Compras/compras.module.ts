import { Module } from "@nestjs/common";
import { ComprasController } from "./compras.controller";
import { ComprasService } from "./compras.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Compras } from "./entity/compras.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Compras])],
    controllers: [ComprasController],
    providers: [ComprasService]
})

export class ComprasModule {}
