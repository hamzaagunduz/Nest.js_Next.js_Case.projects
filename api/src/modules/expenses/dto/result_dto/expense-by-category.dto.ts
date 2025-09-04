// src/modules/expenses/dto/response_dto/expense-by-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ExpenseByCategoryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    categoryId: string;
    @ApiProperty()
    amount: number;

    @ApiProperty({ description: 'Kategori adı' })
    category: string;

    @ApiProperty()
    user: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
