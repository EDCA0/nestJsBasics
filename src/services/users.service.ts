import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
	) {}

	async FindAll(): Promise<Users[]> {
		try {
			const users = await this.usersRepository.find();
			return users;
		} catch {
			throw new BadRequestException('Error al encontrar usuarios');
		}
	}

	async FindOneById(id: number): Promise<Users> {
		try {
			const user = await this.usersRepository.findOne({
				where: {
					id: id,
				},
			});

			if (user === null) {
				throw new NotFoundException('El usuario no existe');
			}

			return user;
		} catch {
			throw new BadRequestException('Error al encontrar usuario');
		}
	}

	async Create(body: CreateUserDto): Promise<Users> {
		try {
			const user = await this.usersRepository.save(body);

			return user;
		} catch {
			throw new BadRequestException('Error al crear el usuario');
		}
	}

	async Update(id: number, changes: UpdateUserDto): Promise<Users> {
		try {
			const user = await this.FindOneById(id);

			const newUser = this.usersRepository.merge(user, changes);

			return newUser;
		} catch {
			throw new BadRequestException('Error al actualizar el usuario');
		}
	}

	async Delete(id: number) {
		try {
			const user = await this.FindOneById(id);
			await this.usersRepository.delete(user.id);
			return { message: 'User deleted' };
		} catch {
			throw new BadRequestException('Error al eliminar el usuario');
		}
	}

	findUserAndProfile(id: number) {
		console.log(id);
	}
}
