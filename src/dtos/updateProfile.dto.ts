import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateProfileDto {
	@IsOptional()
	@IsString({ message: 'El nombre del perfil debe ser una cadena de texto.' })
	@Length(2, 255, { message: 'El nombre del perfil debe tener entre 2 y 255 caracteres.' })
	@ApiProperty({
		description: 'Nombre del usuario',
		example: 'Juan',
	})
	profileName?: string;

	@IsOptional()
	@IsString({ message: 'El apellido del perfil debe ser una cadena de texto.' })
	@Length(2, 255, { message: 'El apellido del perfil debe tener entre 2 y 255 caracteres.' })
	@ApiProperty({
		description: 'Apellido del usuario',
		example: 'Pérez',
	})
	profileLastname?: string;

	@IsOptional()
	@IsEmail({}, { message: 'El formato del email no es válido.' })
	@ApiProperty({
		description: 'Email único del usuario',
		example: 'juan.perez@example.com',
	})
	profileEmail?: string;

	@IsOptional()
	@IsUrl({}, { message: 'La URL del avatar no es válida.' })
	@ApiProperty({
		description: 'URL del avatar del usuario',
		example: 'https://example.com/avatar.jpg',
		required: false,
	})
	profileAvatar?: string;
}
