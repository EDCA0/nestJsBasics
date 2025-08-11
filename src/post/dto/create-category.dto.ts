import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
	/**
	 * El nombre de la categoría. Es un campo obligatorio y debe ser una cadena de texto.
	 * @example 'Programación'
	 */
	@IsString({ message: 'El nombre debe ser una cadena de texto.' })
	@IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
	@MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres.' })
	readonly name: string;
}
