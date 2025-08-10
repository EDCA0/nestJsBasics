import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(Profile)
		private profileRepository: Repository<Profile>,
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
}
