import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateExpenseDto {
    @ApiProperty({ description: 'Harcanan ürün veya hizmet adı' })
    @IsDefined({ message: i18nValidationMessage('validation.isDefined') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    @IsString({ message: i18nValidationMessage('validation.isString') })
    @MaxLength(100, { message: i18nValidationMessage('validation.maxLength', { max: 100 }) })
    title: string;

    @ApiProperty({ description: 'Harcanan tutar' })
    @IsDefined({ message: i18nValidationMessage('validation.isDefined') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    @IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
    amount: number;

    @ApiProperty({ description: 'Kategori ID' })
    @IsDefined({ message: i18nValidationMessage('validation.isDefined') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    @IsString({ message: i18nValidationMessage('validation.isString') })
    category: string;

}
