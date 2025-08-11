import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profiles } from 'src/profiles/entities/profiles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(Profiles)
		private profileRepository: Repository<Profiles>,
	) {}

	async findOneById(id: number): Promise<Profiles> {
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

	async JustFindId(id: number): Promise<Profiles> {
		try {
			const profile = await this.profileRepository.findOne({
				select: {
					id: true,
				},
				where: {
					id: id,
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
