export class CreateDiscountDto {
  name: string;
  maxUses: number;
  percentage: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  discountCode: string;
}

export class modifyDiscountDto {
  name?: string;
  maxUses?: number;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  discountCode?: string;
}

export class DiscountCodeDto {
  discountCode: string;
}
