import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto } from 'src/dtos';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(Profile)
		private profileRepository: Repository<Profile>,
		private userService: UsersService,
	) {}

	async findOneById(id: number): Promise<Profile> {
		try {
			const profile = await this.profileRepository.findOne({
				where: {
					id: id,
				},
				relations: {
					userId: true,
				},
			});

			if (profile === null) {
				throw new NotFoundException('El perfil no existe');
			}

			return profile;
		} catch {
			throw new BadRequestException('Error al encontrar perfil');
		}
	}

	async Create(body: CreateProfileDto): Promise<Profile> {
		try {
			await this.userService.FindOneById(body.userId.id);
			const profile = await this.profileRepository.save(body);

			return profile;
		} catch (error) {
			console.log(error);
			throw new NotFoundException('Error al crear el perfil');
		}
	}
}
