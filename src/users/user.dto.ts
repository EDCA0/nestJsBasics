import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty({ message: 'El nombre no puede estar vacio' })
	@IsString({ message: 'El nombre debe ser un texto' })
	name: string;

	@IsNotEmpty({ message: 'El email no puede estar vacio' })
	@IsEmail({}, { message: 'El email no es valido' })
	email: string;
}

export class UpdateUserDto {
	@IsNotEmpty({ message: 'El nombre no puede estar vacio' })
	@IsString({ message: 'El nombre debe ser un texto' })
	name: string;

	@IsNotEmpty({ message: 'El email no puede estar vacio' })
	@IsEmail({}, { message: 'El email no es valido' })
	email: string;
}
