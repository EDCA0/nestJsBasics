import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Users } from 'src/users/entities/users.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password',
		});
	}

	async validate(email: string, password: string): Promise<Users> {
		const user = await this.authService.validateUser(email, password);
		return user;
	}
}
