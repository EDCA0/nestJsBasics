import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';

interface User {
	id: string;
	name: string;
	email: string;
}

@Controller('users')
export class UsersController {
	private users: User[] = [
		{
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
		},
		{
			id: '2',
			name: 'Jane Doe',
			email: 'jane.doe@example.com',
		},
		{
			id: '3',
			name: 'Juan Perez',
			email: 'jp.doe@example.com',
		},
		{
			id: '4',
			name: 'Pruebas jeje',
			email: 'correo.doe@example.com',
		},
	];

	@Get()
	getUsers(): User[] {
		return this.users;
	}

	@Get(':id')
	findUser(@Param('id') id: string) {
		if (!this.users[Number(id)]) {
			throw new NotFoundException('doesnt exists');
		}
		return this.users.find((user) => user.id === id);
	}

	@Post()
	createUser(@Body() body: CreateUserDto) {
		const lastId = this.users[this.users.length - 1];

		const User = {
			id: String(Number(lastId.id) + 1),
			...body,
		};

		this.users.push(User);
		return { User };
	}

	@Put(':id')
	updateUser(@Param('id') id: string, @Body() changes: UpdateUserDto) {
		const place = this.users.findIndex((user) => user.id === id);

		if (place === -1) {
			throw new NotFoundException('Doesnt exists');
		}

		this.users[place] = {
			id: this.users[place].id,
			...changes,
		};

		return this.users[place];
	}

	@Delete(':id')
	deleteUser(@Param('id') id: string) {
		const place = this.users.findIndex((user) => user.id === id);
		if (place === -1) {
			throw new NotFoundException('Doesnt exists');
		}
		this.users.splice(place, 1);
		return {
			message: 'User deleted',
		};
	}
}
