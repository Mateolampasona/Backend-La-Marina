import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Compras } from "./entity/compras.entity";
import { Repository } from "typeorm";

@Injectable()
export class ComprasService {


constructor(@InjectRepository(Compras) private readonly comprasRepository: Repository<Compras>) {}

async getCompras() {
    const compras = await this.comprasRepository.find({relations:['purchaseDetails']})
    if(!compras){
        throw new BadRequestException('No se encontraron compras')
    }
    return compras
}
async getCompraById(id:string) {
    const compra = await this.comprasRepository.findOne({where:{id}, relations:['purchaseDetails']})
    if(!compra){
        throw new BadRequestException('No se encontró la compra')
    }
    return compra
}

}