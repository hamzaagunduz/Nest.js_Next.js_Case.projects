import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense, ExpenseSchema } from './expense.model';
import { CategoriesModule } from '../categories/categories.module'; // kategori modülüne ihtiyaç varsa

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
        CategoriesModule, // eğer kategori kontrolü yapılacaksa
    ],
    controllers: [ExpensesController],
    providers: [ExpensesService],
    exports: [ExpensesService], // başka modüller kullanacaksa export edebilirsin
})
export class ExpensesModule { }
