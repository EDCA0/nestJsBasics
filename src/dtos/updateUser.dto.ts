import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsStrongPassword()
	userPassword: string;

	@IsOptional()
	@IsEmail({}, { message: 'El email no es valido' })
	userEmail: string;
}
