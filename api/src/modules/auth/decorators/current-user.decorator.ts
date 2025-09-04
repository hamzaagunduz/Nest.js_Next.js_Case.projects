import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentUser = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader) throw new UnauthorizedException('Token yok');

        const token = authHeader.split(' ')[1]; // Bearer <token>
        if (!token) throw new UnauthorizedException('Token eksik');

        const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
        try {
            const payload = jwtService.verify(token);
            return payload; // payload.sub = userId
        } catch {
            throw new UnauthorizedException('Geçersiz token');
        }
    },
);
