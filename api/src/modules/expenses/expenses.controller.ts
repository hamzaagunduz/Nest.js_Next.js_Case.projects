import { Controller, UseGuards, Post, Body, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExpensesService } from './expenses.service';
import { BaseController } from '../../common/base/base.controller';
import { CreateExpenseDto } from './dto/request_dto/create-expense.dto';
import { ExpenseDocument } from './expense.model';
import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator';
import { UpdateExpenseDto } from './dto/request_dto/update-expense.dto';


@ApiTags('expenses')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController extends BaseController<
    CreateExpenseDto,
    CreateExpenseDto,
    ExpenseDocument
> {
    constructor(private readonly expensesService: ExpensesService) {
        super(expensesService);
    }

    // BaseController'daki create'i override ediyoruz
    @Post('category')
    @ApiOperation({ summary: 'Kullanıcı için harcama ekle' })
    @ApiBody({ type: CreateExpenseDto })
    async createForUser(@Body() dto: CreateExpenseDto, @CurrentUser() user: any) {
        return this.expensesService.create({ ...dto, user: user.sub });
    }

    @Put(':id')
    @ApiBody({ type: UpdateExpenseDto })
    async update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
        return this.expensesService.update(id, dto);
    }
    //Dto eklendi
    @Get('categorId/:categoryId')
    @ApiOperation({ summary: 'Kategoriye göre harcamalar' })
    async getByCategory(@Param('categoryId') categoryId: string, @CurrentUser() user: any) {
        return this.expensesService.getUserExpensesByCategory(user.sub, categoryId);
    }
    //Dto eklendi
    @Get('FullExpresUser')
    @ApiOperation({ summary: 'Kullanıcının tüm harcamaları' })
    async getUserExpenses(@CurrentUser() user: any) {
        return this.expensesService.getUserExpenses(user.sub);
    }

    @Get('filter/date')
    @ApiOperation({ summary: 'Tarihe göre filtrelenmiş harcamalar' })
    async getByDate(
        @CurrentUser() user: any,
        @Query('start') start: string,
        @Query('end') end: string
    ) {
        return this.expensesService.getUserExpensesByDate(
            user.sub,
            new Date(start),
            new Date(end)
        );
    }

    @Get('summary/total')
    @ApiOperation({ summary: 'Toplam harcama miktarı' })
    async getTotalSpent(@CurrentUser() user: any) {
        const total = await this.expensesService.getTotalSpent(user.sub);
        return { totalSpent: total };
    }

    @Get('summary/top-category')
    @ApiOperation({ summary: 'En çok harcama yapılan kategori' })
    async getMostSpentCategory(@CurrentUser() user: any) {
        return this.expensesService.getMostSpentCategory(user.sub);
    }

    @Get('summary/stats')
    @ApiOperation({ summary: 'Günlük ve aylık harcama istatistikleri' })
    async getSpendingStats(@CurrentUser() user: any) {
        return this.expensesService.getSpendingStats(user.sub);
    }

    @Get('summary/expenses')
    @ApiOperation({ summary: 'Giriş yapan kullanıcı harcamalarını sayfalama ile getirir' })
    async getUserExpensesPaginated(
        @CurrentUser() user: any,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.expensesService.getUserExpensesPaginated(user.sub, page, limit);
    }

}
