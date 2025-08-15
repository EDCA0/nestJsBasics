import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder().setTitle('Blog API').setDescription('Blog API description').setVersion('1.0').addBearerAuth().build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, documentFactory, {
		jsonDocumentUrl: 'swagger/json',
	});

	app.use(helmet());

	app.enableCors({
		origin: '*', //> Aca se pone el origen o el dominio, en caso de que sea tambien para moviles lo usual es poner * pero en caso contrario
		//> Que solo sea web entonces lo mejor es poner la direccion concreta
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
