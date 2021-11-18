import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './core/filters/http.filter';
import { FallbackExceptionFilter } from './core/filters/fallback.filter';
import { join } from 'path';

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get<Reflector>(Reflector);
  app.useGlobalGuards();
  app.useStaticAssets(join(__dirname, 'public'));
  app.enableCors();
  
  app.setGlobalPrefix('api');
  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter()
  );

  const options = new DocumentBuilder()
    .addApiKey({ type: 'apiKey',  name: 'api_key', in: 'header', description: 'API Key For External calls' })
    .setTitle('Api ')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Api')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(AppModule.port || 5000);
}
bootstrap();
