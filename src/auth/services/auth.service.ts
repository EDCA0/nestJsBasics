import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';
import { Payload } from '../models/payload.model';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, pass: string): Promise<Users> {
		try {
			const user = await this.usersService.AuthByEmail(email);

			if (!user) {
				throw new UnauthorizedException('Unathorized');
			}

			const isMatch = await bcrypt.compare(pass, user.userPassword);

			if (isMatch) {
				const findUser = this.usersService.FindOneById(user.id);
				return findUser;
			} else {
				throw new UnauthorizedException('Unathorized');
			}
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw new UnauthorizedException('Unathorized');
			}
			throw new BadRequestException('Error al autenticar');
		}
	}

	generateToken(user: Users) {
		const payload: Payload = { sub: user.profile.id };
		return this.jwtService.sign(payload);
	}
}
