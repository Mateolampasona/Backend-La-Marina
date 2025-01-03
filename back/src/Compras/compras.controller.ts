import { Controller, Get, HttpCode, HttpException, HttpStatus, Param } from "@nestjs/common";
import { ComprasService } from './compras.service';

@Controller('Compras')  
export class ComprasController{
    constructor(private readonly comprasService: ComprasService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getCompras(){
        try {
            return this.comprasService.getCompras();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getCompraById(@Param('id') id: string){
        try {
            return this.comprasService.getCompraById(id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
}

}