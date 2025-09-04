import { ApiProperty } from '@nestjs/swagger';

export class ExpenseResultDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    category: string;

    @ApiProperty()
    user: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
