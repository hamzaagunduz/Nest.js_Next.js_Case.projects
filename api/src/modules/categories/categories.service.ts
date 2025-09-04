import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.model';
import { BaseService } from '../../common/base/base.service';
import { CreateCategoryDto } from './dto/request_dto/create-category.dto';

@Injectable()
export class CategoriesService extends BaseService<
    CategoryDocument,
    CreateCategoryDto,
    CreateCategoryDto
> {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {
        super(categoryModel);
    }

    async getCategoriesByUser(userId: string): Promise<CategoryDocument[]> {
        return this.categoryModel.find({ user: userId }).exec();
    }
}
