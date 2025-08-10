import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateProfileDto, CreateUserDto, UpdateUserDto } from '../dtos/';
import { UsersService } from 'src/services/users.service';
import { Users } from '../entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
import { ProfileService } from 'src/services/profile.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly profileService: ProfileService,
	) {}
	@Get()
	getUsers(): Promise<Users[]> {
		return this.usersService.FindAll();
	}

	@Get(':id')
	findUser(@Param('id', ParseIntPipe) id: number): Promise<Users> {
		return this.usersService.FindOneById(id);
	}

	@Post()
	createUser(@Body() body: CreateUserDto): Promise<object> {
		return this.usersService.Create(body);
	}

	@Put(':id')
	updateUser(@Param('id', ParseIntPipe) id: number, @Body() changes: UpdateUserDto): Promise<Users> {
		return this.usersService.Update(id, changes);
	}

	@Delete(':id')
	deleteUser(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
		return this.usersService.Delete(id);
	}

	@Post(':id/profile')
	createUserProfile(@Body() body: CreateProfileDto): Promise<Profile> {
		return this.usersService.crateUserProfile(body);
	}

	@Get(':id/profile')
	getProfileById(@Param('id', ParseIntPipe) id: number): Promise<Profile> {
		return this.profileService.findOneById(id);
	}
}
