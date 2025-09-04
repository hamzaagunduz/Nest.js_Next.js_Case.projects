import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../categories/category.model';

export type ExpenseDocument = Expense & Document & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };

@Schema({ timestamps: true })
export class Expense {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    category: Types.ObjectId;

    @Prop()
    user?: string; // JWT’den gelen userId
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
