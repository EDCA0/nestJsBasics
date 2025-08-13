import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async validateUser(email: string, pass: string): Promise<Users> {
		try {
			const user = await this.usersService.FindByEmail(email);

			if (!user) {
				throw new UnauthorizedException('Unathorized');
			}

			const isMatch = await bcrypt.compare(pass, user.userPassword);

			if (isMatch) {
				return user;
			} else {
				throw new UnauthorizedException('Unathorized');
			}
		} catch {
			throw new BadRequestException('Error al autenticar');
		}
	}
}
