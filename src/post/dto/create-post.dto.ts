import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty({ message: 'El título no puede estar vacío.' })
	@IsString({ message: 'El título debe ser una cadena de texto.' })
	@Length(1, 255, { message: 'El título debe tener entre $constraint1 y $constraint2 caracteres.' })
	title: string;

	@IsOptional()
	@IsString({ message: 'El contenido debe ser una cadena de texto.' })
	content?: string;

	@IsOptional()
	@IsUrl({}, { message: 'La URL de la imagen de portada debe ser válida.' })
	@Length(1, 255, { message: 'La URL de la imagen de portada debe tener entre $constraint1 y $constraint2 caracteres.' })
	coverImage?: string;

	@IsOptional()
	@IsString({ message: 'El resumen debe ser una cadena de texto.' })
	@Length(1, 255, { message: 'El resumen debe tener entre $constraint1 y $constraint2 caracteres.' })
	summary?: string;

	@IsArray({ message: 'Las categorías deben ser proporcionadas en formato de arreglo.' })
	@IsNumber({}, { each: true, message: 'Cada ID de categoría debe ser un número.' })
	categoryIds: number[];
}
