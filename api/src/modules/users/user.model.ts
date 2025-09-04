import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @ApiProperty({ description: 'Kullanıcının benzersiz ID değeri (MongoDB ObjectId)' })
    _id: string;

    @ApiProperty({ description: 'Kullanıcı adı' })
    @Prop({ required: true, maxlength: 50 })
    username: string;

    @ApiProperty({ description: 'Kullanıcı e-posta adresi' })
    @Prop({ required: true, unique: true })
    email: string;

    @ApiProperty({ description: 'Kullanıcı şifre hash değeri' })
    @Prop({ required: true, maxlength: 100 })
    password: string;

    @ApiProperty({ description: 'Kullanıcının refresh token değeri (hashli)' })
    @Prop({ required: false })
    refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
