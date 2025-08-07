import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty({ message: 'La contraseña no puede estar vacia' })
	@IsStrongPassword()
	userPassword: string;

	@IsNotEmpty({ message: 'El email no puede estar vacio' })
	@IsEmail({}, { message: 'El email no es valido' })
	userEmail: string;
}
