import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsDefined } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateCategoryDto {
    @ApiProperty({ description: 'Kategori adı' })
    @IsDefined({ message: i18nValidationMessage('validation.isDefined') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    @IsString({ message: i18nValidationMessage('validation.isString') })
    @MaxLength(50, { message: i18nValidationMessage('validation.maxLength', { max: 50 }) })
    name: string;
}
