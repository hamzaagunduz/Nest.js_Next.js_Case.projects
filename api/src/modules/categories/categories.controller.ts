import { Controller, UseGuards, Post, Body, Put, Param, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { BaseController } from '../../common/base/base.controller';
import { CreateCategoryDto } from './dto/request_dto/create-category.dto';
import { CategoryDocument } from './category.model';
import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator';
import { UpdateCategoryDto } from './dto/request_dto/update-category.dto';
import { ApiBody } from '@nestjs/swagger';

@ApiTags('categories')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController extends BaseController<
    CreateCategoryDto,
    CreateCategoryDto,
    CategoryDocument
> {
    constructor(private readonly categoriesService: CategoriesService) {
        super(categoriesService);
    }

    @Post('category')
    @ApiBody({ type: CreateCategoryDto })
    async createForUser(@Body() dto: CreateCategoryDto, @CurrentUser() user: any) {
        // JWT’den aldığımız userId'yi DTO’ya eklemeden direkt modele geçebiliriz
        return this.categoriesService.create({ ...dto, user: user.sub });
    }

    @Put(':id')
    @ApiBody({ type: UpdateCategoryDto })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCategoryDto
    ) {
        return this.categoriesService.update(id, dto);
    }

    @Get('my-categories')
    @ApiOperation({ summary: 'Giriş yapan kullanıcının tüm kategorileri' })
    async getMyCategories(@CurrentUser() user: any) {
        return this.categoriesService.getCategoriesByUser(user.sub);
    }

}
