import { Model, Document, UpdateQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export class BaseService<
    T extends Document,
    TCreate = any,
    TUpdate extends UpdateQuery<T> = UpdateQuery<T>
> {
    constructor(protected readonly model: Model<T>) { }

    async GetAllData(): Promise<T[]> {
        return this.model.find().exec();
    }

    async GetDataById(id: string): Promise<T> {
        const item = await this.model.findById(id).exec();
        if (!item) throw new NotFoundException('Kayıt bulunamadı');
        return item;
    }

    async create(data: TCreate): Promise<T> {
        const newItem = new this.model(data);
        return newItem.save();
    }

    async update(id: string, data: TUpdate): Promise<T> {
        const item = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!item) throw new NotFoundException('Kayıt bulunamadı veya güncellenemedi');
        return item;
    }

    async delete(id: string): Promise<{ deleted: boolean }> {
        const result = await this.model.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) throw new NotFoundException('Kayıt bulunamadı veya silinemedi');
        return { deleted: true };
    }
}
