import { Controller, Get, Param } from '@nestjs/common';

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
	];

	@Get()
	getUsers(): User[] {
		return this.users;
	}

	@Get(':id')
	findUser(@Param('id') id: string) {
		if (!this.users[Number(id)]) {
			return 'NOT FOUND';
		}
		return this.users.find((user) => user.id === id);
	}
}
