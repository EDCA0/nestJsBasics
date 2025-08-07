import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty({ message: 'La contraseña no puede estar vacia' })
	@IsStrongPassword()
	userPassword: string;

	@IsNotEmpty({ message: 'El email no puede estar vacio' })
	@IsEmail({}, { message: 'El email no es valido' })
	userEmail: string;
}

export class UpdateUserDto {
	@IsOptional()
	@IsStrongPassword()
	userPassword: string;

	@IsOptional()
	@IsEmail({}, { message: 'El email no es valido' })
	userEmail: string;
}
