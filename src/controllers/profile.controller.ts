import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateProfileDto } from 'src/dtos';
import { Profile } from 'src/entities/profile.entity';
import { ProfileService } from 'src/services/profile.service';

@Controller('profile')
export class ProfileController {
	constructor(private profileService: ProfileService) {}

	@Post()
	CreateProfile(@Body() body: CreateProfileDto): Promise<Profile> {
		return this.profileService.Create(body);
	}

	@Get(':id')
	GetOneById(@Param('id', ParseIntPipe) id: number): Promise<Profile> {
		return this.profileService.findOneById(id);
	}
}
