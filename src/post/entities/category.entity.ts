/**
 * @fileoverview Entidad que representa una categoría en la base de datos.
 * Define la estructura de la tabla 'categories' y su relación con los posts.
 * @module categories/entities/category.entity
 */
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Posts } from './posts.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad que representa una categoría.
 * @class Categories
 * @extends {BaseEntity}
 */
@Entity({ name: 'categories' })
export class Categories extends BaseEntity {
	/**
	 * Identificador único de la categoría.
	 * @type {number}
	 * @example 1
	 */
	@ApiProperty({
		description: 'Identificador único de la categoría (Clave primaria autoincremental)',
		example: 1,
	})
	@PrimaryGeneratedColumn({
		comment: 'Identificador único de la categoría (Clave primaria autoincremental)',
	})
	id: number;

	/**
	 * Nombre único de la categoría.
	 * @type {string}
	 * @example 'Tecnología'
	 */
	@ApiProperty({
		description: 'Nombre único de la categoría.',
		example: 'Tecnología',
	})
	@Column({
		type: 'varchar',
		length: 255,
		unique: true,
		comment: 'Nombre único de la categoría.',
	})
	name: string;

	/**
	 * Descripción de la categoría.
	 * @type {string}
	 * @example 'Artículos y noticias sobre el mundo de la tecnología.'
	 */
	@ApiProperty({
		description: 'Descripción de la categoría.',
		example: 'Artículos y noticias sobre el mundo de la tecnología.',
		required: false,
	})
	@Column({
		name: 'category_description',
		type: 'varchar',
		length: 800,
		nullable: true,
		comment: 'Descripcion de la categoría.',
	})
	description: string;

	/**
	 * URL de la imagen de portada de la categoría.
	 * @type {string}
	 * @example 'https://example.com/imagen-categoria-tecnologia.jpg'
	 */
	@ApiProperty({
		description: 'URL de la imagen de portada para la categoría.',
		example: 'https://example.com/imagen-categoria-tecnologia.jpg',
		required: false,
	})
	@Column({
		name: 'cover_image',
		type: 'varchar',
		length: 800,
		nullable: true,
		comment: 'URL de la imagen de portada para la categoría.',
	})
	coverImage: string;

	/**
	 * Fecha y hora de creación del registro.
	 * @type {Date}
	 * @example '2023-10-27T10:00:00Z'
	 */
	@ApiProperty({
		description: 'Fecha y hora de creación del registro.',
		example: '2023-10-27T10:00:00Z',
	})
	@CreateDateColumn({
		name: 'created_at',
		comment: 'Fecha y hora de creación del registro. Se establece automáticamente en la inserción.',
	})
	createdAt: Date;

	/**
	 * Fecha y hora de la última actualización del registro.
	 * @type {Date}
	 * @example '2023-10-27T11:30:00Z'
	 */
	@ApiProperty({
		description: 'Fecha y hora de la última actualización.',
		example: '2023-10-27T11:30:00Z',
	})
	@UpdateDateColumn({
		name: 'updated_at',
		comment: 'Fecha y hora de la última actualización. Se modifica automáticamente en cada actualización.',
	})
	updatedAt: Date;

	/**
	 * Los posts que pertenecen a esta categoría.
	 * @type {Posts[]}
	 */
	@ApiProperty({
		description: 'Los posts que pertenecen a esta categoría',
		type: () => [Posts],
	})
	@ManyToMany(() => Posts, (post) => post.categories)
	posts: Posts[];
}
