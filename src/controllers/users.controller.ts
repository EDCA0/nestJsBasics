import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UsersService } from 'src/services/users.service';
import { Users } from '../entities/user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Get()
	getUsers(): Promise<Users[]> {
		return this.usersService.FindAll();
	}

	@Get(':id')
	findUser(@Param('id', ParseIntPipe) id: number): Promise<Users> {
		return this.usersService.FindOneById(id);
	}

	@Post()
	createUser(@Body() body: CreateUserDto): Promise<Users> {
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
}
