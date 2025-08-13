import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Env } from 'src/models/env.model';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<Env>) => ({
				secret: configService.get('JWT_SECRET', { infer: true }),
				signOptions: { expiresIn: '6d' },
			}),
		}),
		// JwtModule.register({
		// 	secret: 'my-secret-key',
		// 	signOptions: { expiresIn: '6d' },
		// }),
	],
	providers: [AuthService, LocalStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
