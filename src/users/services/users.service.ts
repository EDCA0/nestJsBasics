import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto } from 'src/profiles/dto';
import { Profiles } from 'src/profiles/entities/profiles.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { Users } from '../entities/users.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
		@InjectRepository(Profiles)
		private profileRepository: Repository<Profiles>,
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
				relations: {
					profile: true,
				},
			});

			if (user === null) {
				throw new NotFoundException('El usuario no existe');
			}

			return user;
		} catch (error) {
			console.log(error);
			throw new BadRequestException('Error al encontrar usuario');
		}
	}

	async JustFindId(id: number): Promise<Users> {
		try {
			const user = await this.usersRepository.findOne({
				select: {
					id: true,
				},
				where: {
					id: id,
				},
			});

			if (user === null || user === undefined) {
				throw new NotFoundException('El usuario no existe');
			}

			return user;
		} catch {
			throw new BadRequestException('Error al crear el usuario');
		}
	}

	async FindByEmail(email: string): Promise<Users | null> {
		try {
			const user = await this.usersRepository.findOne({
				where: {
					userEmail: email,
				},
			});

			return user;
		} catch {
			throw new BadRequestException('Error al crear el usuario');
		}
	}

	async Create(body: CreateUserDto): Promise<object> {
		try {
			const newUser = this.usersRepository.create(body);
			const savedUser = await this.usersRepository.save(newUser);

			return this.FindOneById(savedUser.id);
		} catch {
			throw new BadRequestException('Error al crear el usuario');
		}
	}

	async Update(id: number, changes: UpdateUserDto): Promise<Users> {
		try {
			const user = await this.FindOneById(id);

			const newUser = this.usersRepository.merge(user, changes);

			await this.usersRepository.save(newUser);

			return newUser;
		} catch {
			throw new BadRequestException('Error al actualizar el usuario');
		}
	}

	async Delete(id: number) {
		try {
			await this.JustFindId(id);
			await this.usersRepository.delete(id);
			return { message: 'User deleted' };
		} catch {
			throw new BadRequestException('Error al eliminar el usuario');
		}
	}

	async createUserProfile(body: CreateProfileDto): Promise<Profiles> {
		try {
			await this.JustFindId(body.userId.id);
			const profile = await this.profileRepository.save(body);

			return profile;
		} catch (error) {
			console.log(error);
			throw new NotFoundException('Error al crear el perfil');
		}
	}
}
