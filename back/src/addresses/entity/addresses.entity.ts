import { User } from 'src/Users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Provinces {
  BUENOS_AIRES = 'Buenos Aires',
  CATAMARCA = 'Catamarca',
  CHACO = 'Chaco',
  CHUBUT = 'Chubut',
  CORDOBA = 'Córdoba',
  CORRIENTES = 'Corrientes',
  ENTRE_RIOS = 'Entre Ríos',
  FORMOSA = 'Formosa',
  JUJUY = 'Jujuy',
  LA_PAMPA = 'La Pampa',
  LA_RIOJA = 'La Rioja',
  MENDOZA = 'Mendoza',
  MISIONES = 'Misiones',
  NEUQUEN = 'Neuquén',
  RIO_NEGRO = 'Río Negro',
  SALTA = 'Salta',
  SAN_JUAN = 'San Juan',
  SAN_LUIS = 'San Luis',
  SANTA_CRUZ = 'Santa Cruz',
  SANTA_FE = 'Santa Fe',
  SANTIAGO_DEL_ESTERO = 'Santiago del Estero',
  TIERRA_DEL_FUEGO = 'Tierra del Fuego',
  TUCUMAN = 'Tucumán',
}

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn({ name: 'address_id' })
  addressId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  address: string;

  @Column({ type: 'int', nullable: false })
  number: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  city: string;

  @Column({ type: 'enum', enum: Provinces, nullable: false })
  state: Provinces;

  @Column({ type: 'varchar', length: 50, nullable: false })
  country: string = 'Argentina';

  @Column({ type: 'varchar', length: 50, nullable: false })
  postalCode: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  comments: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
