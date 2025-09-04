import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Kategori adı' })
    @IsDefined({ message: i18nValidationMessage('validation.isDefined') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    @IsString({ message: i18nValidationMessage('validation.isString') })
    @MaxLength(50, { message: i18nValidationMessage('validation.maxLength', { max: 50 }) })
    name: string;

    user?: string; // opsiyonel

}
