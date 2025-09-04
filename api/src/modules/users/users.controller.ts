import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))  // <-- JWT guard ekledik
    @ApiBearerAuth()              // <-- Swagger'da Authorization butonu çıkar
    @ApiResponse({ status: 200, description: 'Kullanıcılar başarıyla listelendi.' })
    async getUsers() {
        return this.usersService.findAll();
    }
}
