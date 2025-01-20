import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entity/discount.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto, modifyDiscountDto } from './dto/createDiscount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async createDiscount(createDiscountDto: CreateDiscountDto) {
    try {
      const createdDiscount =
        await this.discountRepository.save(createDiscountDto);
      return await this.discountRepository.save(createdDiscount);
    } catch (error) {
      throw new BadRequestException(
        `An error ocurred while creating discount: ${error}`,
      );
    }
  }

  async deleteDiscount(id: number) {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      throw new BadRequestException('Discount not found');
    }
    await this.discountRepository.delete(discount);
    return { message: `Discount with ID ${id} sucesfully deleted` };
  }

  async getAllDiscount() {
    const discounts = await this.discountRepository.find({
      relations: ['orders'],
    });
    return discounts;
  }

  async getDiscountById(id: number) {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
    if (!discount) {
      throw new BadRequestException('Discount not found');
    }
    return discount;
  }

  async getDiscountByName(name: string) {
    const discount = await this.discountRepository.findOne({
      where: { name },
      relations: ['orders'],
    });
    if (!discount) {
      throw new BadRequestException('Discount not found');
    }
    return discount;
  }

  async updateDiscount(modifyDiscountDto: modifyDiscountDto, id: number) {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      throw new BadRequestException('Discount not found');
    }
    await this.discountRepository.update(id, modifyDiscountDto);
    const updatedDiscount = await this.discountRepository.findOne({
      where: { id },
    });
    return {
      message: `Discount with ID ${id} sucesfully updated`,
      updatedDiscount,
    };
  }

  async getDiscountByCode(discountCode: string) {
    const discount = await this.discountRepository.findOne({
      where: { discountCode },
    });
    if (!discount) {
      throw new BadRequestException('Discount not found');
    }
    return discount;
  }
}
