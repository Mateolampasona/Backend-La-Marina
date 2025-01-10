import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Req, UseGuards } from "@nestjs/common";
import { ComprasService } from './compras.service';
import { Roles } from "src/decorators/roles.decorator";
import { RoleGuard } from "src/Auth/roles.guard";
import { Role } from "src/Auth/enum/roles.enum";
import { AuthGuard } from "@nestjs/passport";

@Controller('compras')  
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
    @Roles(Role.Admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Get('total-ventas')
@HttpCode(HttpStatus.OK)
async getTotalVentas(){
    try {
        return this.comprasService.getTotalVentas();
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
}

@Roles(Role.Admin, Role.User,Role.Vip)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Get('compras-by-user')
@HttpCode(HttpStatus.OK)
async getComprasByUser(@Req() req:any){
    const user = req.user;
    console.log(user)
    try {
        return this.comprasService.getComprasByUser(user);
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
}

@Roles(Role.Admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Get('last-compra')
@HttpCode(HttpStatus.OK)
async getLastCompra(){
    try {
        return this.comprasService.getLastcompra();
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
