import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
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

	FindAll(): User[] {
		return this.users;
	}

	FindOneById(id: string): User {
		const user = this.users.find((user) => user.id === id);
		if (!user) {
			throw new NotFoundException('doesnt exists');
		}
		return user;
	}

	Create(user: CreateUserDto) {
		const lastId = this.users[this.users.length - 1];

		const User = {
			id: String(Number(lastId.id) + 1),
			...user,
		};

		this.users.push(User);
		return { User };
	}

	Update(id: string, changes: UpdateUserDto) {
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

	Delete(id: string) {
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
