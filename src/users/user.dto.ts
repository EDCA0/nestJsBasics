import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUrl, Length, ValidateNested } from 'class-validator';

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

export class CreateProfileDto {
	@IsNotEmpty({ message: 'El nombre del perfil no puede estar vacío.' })
	@IsString({ message: 'El nombre del perfil debe ser una cadena de texto.' })
	@Length(2, 255, { message: 'El nombre del perfil debe tener entre 2 y 255 caracteres.' })
	@ApiProperty({
		description: 'Nombre del usuario',
		example: 'Juan',
	})
	profileName: string;

	@IsNotEmpty({ message: 'El apellido del perfil no puede estar vacío.' })
	@IsString({ message: 'El apellido del perfil debe ser una cadena de texto.' })
	@Length(2, 255, { message: 'El apellido del perfil debe tener entre 2 y 255 caracteres.' })
	@ApiProperty({
		description: 'Apellido del usuario',
		example: 'Pérez',
	})
	profileLastname: string;

	@IsNotEmpty({ message: 'El email del perfil no puede estar vacío.' })
	@IsEmail({}, { message: 'El formato del email no es válido.' })
	@ApiProperty({
		description: 'Email único del usuario',
		example: 'juan.perez@example.com',
	})
	profileEmail: string;

	@IsOptional()
	@IsUrl({}, { message: 'La URL del avatar no es válida.' })
	@ApiProperty({
		description: 'URL del avatar del usuario',
		example: 'https://example.com/avatar.jpg',
		required: false,
	})
	profileAvatar?: string;

	@ValidateNested()
	@Type(() => CreateUserDto)
	@IsNotEmpty({ message: 'El userId no puede estar vacio' })
	user: CreateUserDto;
}
