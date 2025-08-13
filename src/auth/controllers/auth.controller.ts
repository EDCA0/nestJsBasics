import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

import type { Request } from 'express';
import { Users } from 'src/users/entities/users.entity';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	login(@Req() request: Request) {
		const user = request.user as Users;

		return {
			user,
			access_token: this.authService.generateToken(user),
		};
	}
}
