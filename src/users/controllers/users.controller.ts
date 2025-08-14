import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from 'src/profiles/dto';
import { Profiles } from 'src/profiles/entities/profiles.entity';
import { ProfileService } from 'src/profiles/services/profile.service';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { Users } from '../entities/users.entity';
import { Posts } from 'src/post/entities/posts.entity';
import { PostService } from 'src/post/services/post.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly profileService: ProfileService,
		private readonly postService: PostService,
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
	createUserProfile(@Param('id', ParseIntPipe) id: number, @Body() body: CreateProfileDto): Promise<Profiles> {
		return this.usersService.createUserProfile(body, id);
	}

	@Get(':id/profile')
	getProfileById(@Param('id', ParseIntPipe) id: number): Promise<Profiles> {
		return this.profileService.findOneById(id);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get(':id/profile/posts')
	getPostByProfile(@Param('id', ParseIntPipe) id: number): Promise<Posts[]> {
		return this.postService.FindAllByProfile(id);
	}
}
