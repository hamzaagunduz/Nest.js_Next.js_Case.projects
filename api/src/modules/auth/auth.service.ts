import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async login(user: User) {
        const payload = { sub: user._id, email: user.email };

        // Access token
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '30m'
        });

        // Refresh token
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        // 🔹 Refresh token DB’ye kaydediliyor
        await this.usersService.updateRefreshToken(user._id, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

}
