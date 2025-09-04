// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    // Tüm kullanıcıları listele
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    // Yeni kullanıcı ekle
    async create(username: string, email: string, password: string): Promise<User> {
        const user = new this.userModel({ username, email, password });
        return user.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(userId: string): Promise<User | null> {
        return this.userModel.findById(userId).exec();
    }

    // Şifre hashleme yardımcı fonksiyon
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    // Refresh token kaydet (hashlenmiş olarak)
    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    // Refresh token sil (logout için)
    async removeRefreshToken(userId: string) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    }

    // Refresh token doğrula
    async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        const user = await this.userModel.findById(userId).exec();
        if (!user || !user.refreshToken) return false;
        return bcrypt.compare(refreshToken, user.refreshToken);
    }
}
