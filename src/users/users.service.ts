import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserResponse } from './user.model';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
	) {}

	async FindAll(): Promise<Users[]> {
		const users = await this.usersRepository.find();
		return users;
	}

	async FindOneById(id: number, needFullUser?: boolean): Promise<UserResponse | Users> {
		const user = await this.usersRepository.findOne({
			where: {
				id: id,
			},
		});

		if (user === null) {
			throw new NotFoundException('El usuario no existe');
		}

		if (needFullUser) {
			return user;
		}

		const userResponse: UserResponse = {
			id: user.id,
			email: user.userEmail,
			createdAt: user.createdAt,
		};

		return userResponse;
	}

	async Create(body: CreateUserDto): Promise<UserResponse> {
		try {
			const thisUser = await this.usersRepository.save(body);

			const userResponse: UserResponse = {
				id: thisUser.id,
				email: thisUser.userEmail,
				createdAt: thisUser.createdAt,
			};

			return userResponse;
		} catch {
			throw new BadRequestException('Error creating user');
		}
	}

	async Update(id: number, changes: UpdateUserDto): Promise<boolean | UserResponse> {
		const user = await this.FindOneById(id, true);

		if (user instanceof Users) {
			const newUser = this.usersRepository.merge(user, changes);

			const userResponse: UserResponse = {
				id: newUser.id,
				email: newUser.userEmail,
				updatedAt: newUser.updatedAt,
			};

			return userResponse;
		}

		return false;
	}

	async Delete(id: number) {
		const user = await this.FindOneById(id);
		await this.usersRepository.delete(user.id);
		return { message: 'User deleted' };
	}
}
