import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Kullanıcı girişi yap' })
    @ApiResponse({ status: 200, description: 'Access & refresh token döner' })
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);
        // Login sırasında refresh token DB'ye kaydedilecek
        return this.authService.login(user);
    }

    @Post('register')
    @ApiOperation({ summary: 'Yeni kullanıcı kaydı oluştur' })
    @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' })
    async register(@Body() body: RegisterDto) {
        const hashedPassword = await this.usersService.hashPassword(body.password);
        await this.usersService.create(body.username, body.email, hashedPassword);

        return { message: 'Kullanıcı başarıyla oluşturuldu.' };
    }
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh token ile yeni access token üret' })
    @ApiResponse({ status: 200, description: 'Yeni access token döner' })
    async refresh(@Body() body: RefreshDto) {
        let payload: any;

        try {
            payload = this.authService['jwtService'].verify(body.refresh_token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        } catch {
            throw new UnauthorizedException('Geçersiz refresh token');
        }

        // DB’de refresh token doğrulaması
        const isValid = await this.usersService.validateRefreshToken(payload.sub, body.refresh_token);
        if (!isValid) throw new UnauthorizedException('Geçersiz refresh token');

        // Kullanıcıyı bul
        const user = await this.usersService.findById(payload.sub);
        if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');

        // Yeni access + refresh token üret
        return this.authService.login(user);
    }

}
