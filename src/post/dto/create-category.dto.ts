/**
 * @fileoverview DTO para la creación de una nueva categoría.
 * Define los campos y las reglas de validación necesarias para crear una categoría.
 * Utiliza decoradores de 'class-validator' y '@nestjs/swagger' para la validación y documentación.
 * @module categories/dto/create-category.dto
 */
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) para crear una categoría.
 * @class CreateCategoryDto
 */
export class CreateCategoryDto {
	/**
	 * El nombre de la categoría. Es un campo obligatorio, debe ser único.
	 * @type {string}
	 * @example 'Tecnología'
	 */
	@ApiProperty({
		description: 'El nombre de la categoría, debe ser único.',
		example: 'Tecnología',
		minLength: 1,
		maxLength: 255,
	})
	@IsString({ message: 'El nombre debe ser una cadena de texto.' })
	@IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
	@MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres.' })
	readonly name: string;
}
