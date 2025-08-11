import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad que representa un post o entrada de blog.
 * Esta clase mapea a la tabla 'posts' en la base de datos.
 */
@Entity({
	name: 'posts',
})
export class Post extends BaseEntity {
	/**
	 * Identificador único del post.
	 * Es la clave primaria de la tabla.
	 */
	@PrimaryGeneratedColumn({
		comment: 'Identificador único del post',
	})
	id: number;

	/**
	 * Título del post.
	 * No puede ser nulo y tiene una longitud máxima de 255 caracteres.
	 */
	@Column({
		type: 'varchar',
		length: 255,
		comment: 'Título del post',
	})
	title: string;

	/**
	 * Contenido principal del post.
	 * Se almacena como texto largo y es opcional (puede ser nulo).
	 */
	@Column({
		type: 'text',
		nullable: true,
		comment: 'Contenido principal del post',
	})
	content: string;

	/**
	 * URL o ruta de la imagen de portada del post.
	 * Es opcional y se almacena como varchar.
	 */
	@Column({
		type: 'varchar',
		length: 255,
		name: 'cover_image',
		nullable: true,
		comment: 'URL de la imagen de portada del post',
	})
	coverImage: string;

	/**
	 * Resumen o descripción corta del post.
	 * Es opcional y se usa para vistas previas.
	 */
	@Column({
		type: 'varchar',
		length: 255,
		name: 'summary',
		nullable: true,
		comment: 'Resumen o descripción corta del post',
	})
	summary: string;

	/**
	 * Bandera para indicar si el post es un borrador.
	 * Por defecto es 'true' (borrador).
	 */
	@Column({
		type: 'boolean',
		default: true,
		name: 'is_draft',
		comment: 'Indica si el post es un borrador',
	})
	isDraft: boolean;

	/**
	 * Marca de tiempo de la creación del registro.
	 * Se genera automáticamente al crear un nuevo post.
	 */
	@CreateDateColumn({
		name: 'created_at',
		comment: 'Fecha y hora de creación del post',
	})
	createdAt: Date;

	/**
	 * Marca de tiempo de la última actualización del registro.
	 * Se actualiza automáticamente en cada modificación.
	 */
	@UpdateDateColumn({
		name: 'updated_at',
		comment: 'Fecha y hora de la última actualización del post',
	})
	updatedAt: Date;
}
