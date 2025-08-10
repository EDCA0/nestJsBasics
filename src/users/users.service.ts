import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto } from 'src/profiles/dto';
import { Profile } from 'src/profiles/profile.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Users } from './user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
		@InjectRepository(Profile)
		private profileRepository: Repository<Profile>,
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

	async Create(body: CreateUserDto): Promise<object> {
		try {
			const user = await this.usersRepository.save(body);

			const responseUser = {
				id: user.id,
				email: user.userEmail,
				created_at: user.createdAt,
			};

			return responseUser;
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

	async crateUserProfile(body: CreateProfileDto): Promise<Profile> {
		try {
			await this.FindOneById(body.userId.id);
			const profile = await this.profileRepository.save(body);

			return profile;
		} catch (error) {
			console.log(error);
			throw new NotFoundException('Error al crear el perfil');
		}
	}
}
