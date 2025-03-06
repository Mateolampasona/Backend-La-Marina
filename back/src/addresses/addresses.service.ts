import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entity/addresses.entity';
import { Repository } from 'typeorm';
import { User } from 'src/Users/entity/user.entity';
import { CreateAddresDto } from './dto/createAddress.dto';
import { UpdateAddresDto } from './dto/updateAddres.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getAllAddresses(): Promise<Address[]> {
    const address = await this.addressRepository.find();
    return address;
  }

  async getAddressesUser(user: any): Promise<Address[]> {
    const userAddress = await this.addressRepository.find({
      where: { user: user },
    });
    return userAddress;
  }
  async getAddresById(id: number): Promise<Address> {
    const addresById = await this.addressRepository.findOne({
      where: { addressId: id },
    });
    if (!addresById) {
      throw new BadGatewayException('Address not found');
    }
    return addresById;
  }

  async updateAddressUser(
    dataUser: any,
    id: number,
    updateAddresDto: UpdateAddresDto,
  ) {
    const userAddress = await this.addressRepository.findOne({
      where: { addressId: id },
      relations: ['user'],
    });
    if (!userAddress) {
      throw new BadGatewayException('Address not found');
    }
    const user = await this.userRepository.findOne({
      where: { userId: dataUser.userId },
    });
    if (user.role === 'admin') {
      await this.addressRepository.update(id, updateAddresDto);
      return await this.addressRepository.findOne({
        where: { addressId: id },
      });
    }
    if (userAddress.user.userId !== dataUser.userId) {
      throw new BadGatewayException(
        'You are not authorized to update this address',
      );
    }
    await this.addressRepository.update(id, updateAddresDto);
    return await this.addressRepository.findOne({
      where: { addressId: id },
    });
  }

  async createAddressUser(dataUser: any, createAddresDto: CreateAddresDto) {
    const user = await this.userRepository.findOne({
      where: { userId: dataUser.userId },
    });
    if (!user) {
      throw new BadGatewayException('User not found');
    }
    const address = this.addressRepository.create({
      ...createAddresDto,
      user,
    });
    await this.addressRepository.save(address);
    return await this.addressRepository.findOne({
      where: { addressId: address.addressId },
    });
  }

  async deleteAddressUser(dataUser: any, id: number) {
    const userAddress = await this.addressRepository.findOne({
      where: { addressId: id },
      relations: ['user'],
    });
    if (!userAddress) {
      throw new BadGatewayException('Address not found');
    }
    const user = await this.userRepository.findOne({
      where: { userId: dataUser.userId },
    });
    if (user.role === 'admin') {
      await this.addressRepository.delete(id);
      return { message: 'Address deleted' };
    }

    if (userAddress.user.userId !== dataUser.userId) {
      throw new BadGatewayException(
        'You are not authorized to delete this address',
      );
    }
    await this.addressRepository.delete(id);
    return { message: 'Address deleted' };
  }
}
