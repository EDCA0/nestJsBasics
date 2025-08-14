/**
 * @fileoverview DTO para la creación de un nuevo post.
 * Define los campos y las reglas de validación necesarias para la creación de una publicación.
 * Utiliza decoradores de 'class-validator' y '@nestjs/swagger' para la validación y documentación.
 * @module posts/dto/create-post.dto
 */
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) para crear un post.
 * @class CreatePostDto
 */
export class CreatePostDto {
	/**
	 * El título del post. Es un campo obligatorio.
	 * @type {string}
	 * @example 'Mi primer post'
	 */
	@ApiProperty({
		description: 'El título del post.',
		example: 'Mi primer post',
		minLength: 1,
		maxLength: 255,
	})
	@IsNotEmpty({ message: 'El título no puede estar vacío.' })
	@IsString({ message: 'El título debe ser una cadena de texto.' })
	@Length(1, 255, { message: 'El título debe tener entre $constraint1 y $constraint2 caracteres.' })
	title: string;

	/**
	 * El contenido principal del post. Campo opcional.
	 * @type {string}
	 * @example 'Este es el contenido detallado de mi primer post.'
	 */
	@ApiProperty({
		description: 'El contenido principal del post. Opcional.',
		example: 'Este es el contenido detallado de mi primer post.',
		required: false,
	})
	@IsOptional()
	@IsString({ message: 'El contenido debe ser una cadena de texto.' })
	content?: string;

	/**
	 * La URL de la imagen de portada del post. Campo opcional.
	 * Debe ser una URL válida.
	 * @type {string}
	 * @example 'https://example.com/imagen-portada.jpg'
	 */
	@ApiProperty({
		description: 'La URL de la imagen de portada del post. Opcional.',
		example: 'https://example.com/imagen-portada.jpg',
		required: false,
		minLength: 1,
		maxLength: 255,
	})
	@IsOptional()
	@IsUrl({}, { message: 'La URL de la imagen de portada debe ser válida.' })
	@Length(1, 255, { message: 'La URL de la imagen de portada debe tener entre $constraint1 y $constraint2 caracteres.' })
	coverImage?: string;

	/**
	 * Un resumen corto del post. Campo opcional.
	 * @type {string}
	 * @example 'Un resumen conciso sobre el tema del post.'
	 */
	@ApiProperty({
		description: 'Un resumen corto del post. Opcional.',
		example: 'Un resumen conciso sobre el tema del post.',
		required: false,
		minLength: 1,
		maxLength: 255,
	})
	@IsOptional()
	@IsString({ message: 'El resumen debe ser una cadena de texto.' })
	@Length(1, 255, { message: 'El resumen debe tener entre $constraint1 y $constraint2 caracteres.' })
	summary?: string;

	/**
	 * Un arreglo de IDs de categorías a las que pertenece el post. Campo obligatorio.
	 * @type {number[]}
	 * @example [1, 2, 3]
	 */
	@ApiProperty({
		description: 'Un arreglo de IDs de categorías a las que pertenece el post.',
		example: [1, 2, 3],
		type: [Number],
	})
	@IsArray({ message: 'Las categorías deben ser proporcionadas en formato de arreglo.' })
	@IsNumber({}, { each: true, message: 'Cada ID de categoría debe ser un número.' })
	categoryIds: number[];
}
