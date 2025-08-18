import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Env } from './models/env.model';
import { ProfilesModule } from './profiles/profile.module';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join(__dirname, '..', '..', '.env'),
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService<Env>) => ({
				type: 'postgres',
				host: configService.get('POSTGRES_HOST', { infer: true }),
				port: configService.get('POSTGRES_PORT', { infer: true }),
				username: configService.get('POSTGRES_USER', { infer: true }),
				password: configService.get('POSTGRES_PASSWORD', { infer: true }),
				database: configService.get('POSTGRES_DB', { infer: true }),
				autoLoadEntities: true,
				synchronize: false,
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		ProfilesModule,
		PostModule,
		AuthModule,
	],
})
export class AppModule {}
