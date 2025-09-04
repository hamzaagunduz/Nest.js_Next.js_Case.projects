import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

export class BaseController<
    TCreate = any,
    TUpdate = TCreate,
    TModel = any
> {
    constructor(private readonly service: any) { }

    @Get()
    async GetAll(): Promise<TModel[]> {
        return this.service.GetAllData();
    }

    @Get(':id')
    async GetById(@Param('id') id: string): Promise<TModel> {
        return this.service.GetDataById(id);
    }

    @Post()
    async create(@Body() dto: TCreate): Promise<TModel> {
        return this.service.create(dto);
    }


    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: TUpdate): Promise<TModel> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
        return this.service.delete(id);
    }
}
