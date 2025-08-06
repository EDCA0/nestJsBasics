import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';
import type { User } from './user.model';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Get()
	getUsers(): User[] {
		return this.usersService.FindAll();
	}

	@Get(':id')
	findUser(@Param('id') id: string): User {
		return this.usersService.FindOneById(id);
	}

	@Post()
	createUser(@Body() body: CreateUserDto) {
		return this.usersService.Create(body);
	}

	@Put(':id')
	updateUser(@Param('id') id: string, @Body() changes: UpdateUserDto): User {
		return this.usersService.Update(id, changes);
	}

	@Delete(':id')
	deleteUser(@Param('id') id: string) {
		return this.usersService.Delete(id);
	}
}
