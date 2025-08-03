import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:5000'],
      credentials: true,
    },
  });
  const PORT = process.env.BACKEND_APP_PORT || 3000;
  app.use(cookieParser());

  // Serve the Swagger UI at /api-docs
  // localhost:3000/api-docs
  const config = new DocumentBuilder()
    .setTitle('Events API')
    .setDescription('The events API description')
    .setVersion('1.0')
    .addTag('events')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, documentFactory);

  //add events prefix to all routes
  app.setGlobalPrefix('events');

  // add v1 prefix to all routes
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT, () => {
    console.log(`Events API is running on Port ${PORT}`);
  });
}
bootstrap();
