import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Compras } from "./compras.entity";
import { Product } from "src/Products/entity/productos.entity";

@Entity("purchase_detail")
export class PurchaseDetail {
    @PrimaryGeneratedColumn('uuid')
    id:string
    
    @ManyToOne(() => Compras, (compra) => compra.purchaseDetails)
    compra: Compras

    @ManyToOne(() => Product)
    product: Product

    @Column()
    quantity: number

    @Column()
    subtotal: number
}