import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module'; // <-- ekledik
import { ExpensesModule } from './modules/expenses/expenses.module'; // <-- ekledik
import { AuthModule } from './modules/auth/auth.module';

import { I18nModule, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CategoriesModule,
    UsersModule,
    ExpensesModule,
    AuthModule,


    I18nModule.forRoot({
      fallbackLanguage: 'tr',
      loaderOptions: {
        path: path.join(__dirname, '..', 'src', 'i18n'), // dist altından src/i18n'e git
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],


    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
