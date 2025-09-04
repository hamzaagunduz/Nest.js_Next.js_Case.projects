import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './expense.model';
import { BaseService } from '../../common/base/base.service';
import { CreateExpenseDto } from './dto/request_dto/create-expense.dto';
import { ExpenseByCategoryDto } from './dto/result_dto/expense-by-category.dto';
import { ExpenseResultDto } from './dto/result_dto/expense-result.dto';

@Injectable()
export class ExpensesService extends BaseService<
    ExpenseDocument,
    CreateExpenseDto,
    CreateExpenseDto
> {
    constructor(@InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>) {
        super(expenseModel);
    }

    async findByCategory(categoryId: string) {
        return this.expenseModel.find({ category: categoryId }).exec();
    }

    // Kullanıcının tüm harcamaları Dto
    async getUserExpenses(userId: string): Promise<ExpenseResultDto[]> {
        const expenses = await this.expenseModel.find({ user: userId }).sort({ createdAt: -1 }).exec();

        return expenses.map(exp => ({
            id: exp._id.toString(), // artık hata vermez
            title: exp.title,
            amount: exp.amount,
            category: exp.category.toString(),
            user: exp.user ? exp.user.toString() : '',
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt,
        }));
    }


    // Kategoriye göre filtreleme
    async getUserExpensesByCategory(userId: string, categoryId: string): Promise<ExpenseByCategoryDto[]> {
        const expenses = await this.expenseModel
            .find({ user: userId, category: categoryId })
            .populate('category', 'name')
            .exec();

        return expenses.map(exp => ({
            id: exp._id.toString(),
            title: exp.title,
            amount: exp.amount,
            categoryId: (categoryId),
            category: (exp.category as any)?.name || '', // <--- burası değişti
            user: exp.user ? exp.user.toString() : '',
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt,
        }));
    }


    // Tarihe göre filtreleme
    async getUserExpensesByDate(userId: string, startDate: Date, endDate: Date) {
        return this.expenseModel.find({
            user: userId,
            createdAt: { $gte: startDate, $lte: endDate },
        }).exec();
    }


    // Toplam harcama
    async getTotalSpent(userId: string) {
        const result = await this.expenseModel.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        return result[0]?.total || 0;
    }

    // En çok harcama yapılan kategori

    async getMostSpentCategory(userId: string) {
        const result = await this.expenseModel.aggregate([
            {
                $match: { user: userId }
            },
            {
                $addFields: {
                    categoryObjId: { $toObjectId: "$category" }
                }
            },
            {
                $group: {
                    _id: "$categoryObjId",
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    categoryName: "$category.name",
                    total: 1
                }
            }
        ]);

        return result[0] || null;
    }


    async getSpendingStats(userId: string) {
        const result = await this.expenseModel.aggregate([
            {
                $match: { user: userId }
            },
            {
                $addFields: {
                    createdAtDate: {
                        $toDate: "$createdAt" // string değil tarih olduğundan gerek yok ama garanti olsun
                    }
                }
            },
            {
                $facet: {
                    daily: [
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAtDate" } },
                                total: { $sum: "$amount" }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    monthly: [
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m", date: "$createdAtDate" } },
                                total: { $sum: "$amount" }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]);

        // result[0] = { daily: [...], monthly: [...] }
        return result[0];
    }

    // Giriş yapan kullanıcı harcamalarını sayfalama ile getirme
    async getUserExpensesPaginated(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const total = await this.expenseModel.countDocuments({ user: userId });

        const expenses = await this.expenseModel
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
            .exec();

        const data = expenses.map(exp => ({
            id: exp._id.toString(),
            title: exp.title,
            amount: exp.amount,
            category: (exp.category as any)?.name || '',
            categoryId: (exp.category as any)?._id?.toString() || '',
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt,
        }));

        return {
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

}
