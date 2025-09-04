// src/modules/auth/dto/refresh.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
        description: 'Valid refresh token',
    })
    @IsString()
    @IsNotEmpty()
    refresh_token: string;
}
