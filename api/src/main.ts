import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth() // JWT Auth eklemek için
    .build();

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter: (errors) => {
        return errors.flatMap((error) =>
          Object.values(error.constraints ?? {}),
        );
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor()); // global interceptor ekle
  app.enableCors({
    origin: 'http://localhost:3001', // Next.js client URL
    credentials: true,
  });



  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // '/api' endpointinden ulaşılır

  await app.listen(3000);
}
bootstrap();
