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
    const compra = await this.comprasRepository.findOne({where:{compraId:id}, relations:['purchaseDetails']})
    if(!compra){
        throw new BadRequestException('No se encontró la compra')
    }
    return compra
}

async getTotalVentas() {
    const compras = await this.comprasRepository.find();
    if (!compras || compras.length === 0) {
      throw new BadRequestException('No se encontraron compras');
    }
    const totalVentas = compras.reduce((sum, compra) => sum + compra.total, 0);
    return  totalVentas ;
}

async getLastcompra() {
    const [lastCompra] = await this.comprasRepository.find({ order: { purchaseDate: 'DESC' }, take: 1 });
if(!lastCompra){
    throw new BadRequestException('No se encontró la última compra')
}
return lastCompra
}

async getComprasByUser(user: any) {
    const compras = await this.comprasRepository.find({ where: { user }, relations: ['purchaseDetails'] });
    if(!compras){
        throw new BadRequestException('No se encontraron compras')
    }
    return compras
}


}