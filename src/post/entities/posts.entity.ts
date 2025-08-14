/**
 * @fileoverview Entidad que representa un post en la base de datos.
 * Define la estructura de la tabla 'posts' con sus columnas, relaciones y comentarios.
 * @module posts/entities/posts.entity
 */
import { Profiles } from 'src/profiles/entities/profiles.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Categories } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad que representa un post.
 * @class Posts
 * @extends {BaseEntity}
 */
@Entity({
	name: 'posts',
})
export class Posts extends BaseEntity {
	/**
	 * Identificador único del post.
	 * @type {number}
	 * @example 1
	 */
	@ApiProperty({
		description: 'Identificador único del post',
		example: 1,
	})
	@PrimaryGeneratedColumn({
		comment: 'Identificador único del post',
	})
	id: number;

	/**
	 * Título del post.
	 * @type {string}
	 * @example 'Mi primer post'
	 */
	@ApiProperty({
		description: 'Título del post',
		example: 'Mi primer post',
		maxLength: 255,
	})
	@Column({
		type: 'varchar',
		length: 255,
		comment: 'Título del post',
	})
	title: string;

	/**
	 * Contenido principal del post.
	 * @type {string}
	 * @example 'Este es el contenido detallado de mi primer post.'
	 */
	@ApiProperty({
		description: 'Contenido principal del post',
		example: 'Este es el contenido detallado de mi primer post.',
		required: false,
	})
	@Column({
		type: 'text',
		nullable: true,
		comment: 'Contenido principal del post',
	})
	content: string;

	/**
	 * URL de la imagen de portada del post.
	 * @type {string}
	 * @example 'https://example.com/imagen-portada.jpg'
	 */
	@ApiProperty({
		description: 'URL de la imagen de portada del post',
		example: 'https://example.com/imagen-portada.jpg',
		required: false,
	})
	@Column({
		type: 'varchar',
		length: 900,
		name: 'cover_image',
		nullable: true,
		comment: 'URL de la imagen de portada del post',
	})
	coverImage: string;

	/**
	 * Resumen o descripción corta del post.
	 * @type {string}
	 * @example 'Un resumen conciso sobre el tema del post.'
	 */
	@ApiProperty({
		description: 'Resumen o descripción corta del post',
		example: 'Un resumen conciso sobre el tema del post.',
		required: false,
		maxLength: 255,
	})
	@Column({
		type: 'varchar',
		length: 255,
		name: 'summary',
		nullable: true,
		comment: 'Resumen o descripción corta del post',
	})
	summary: string;

	/**
	 * Indica si el post es un borrador.
	 * @type {boolean}
	 * @default true
	 */
	@ApiProperty({
		description: 'Indica si el post es un borrador',
		example: true,
		default: true,
	})
	@Column({
		type: 'boolean',
		default: true,
		name: 'is_draft',
		comment: 'Indica si el post es un borrador',
	})
	isDraft: boolean;

	/**
	 * Fecha y hora de creación del post.
	 * @type {Date}
	 * @example '2023-10-27T10:00:00Z'
	 */
	@ApiProperty({
		description: 'Fecha y hora de la creación del post',
		example: '2023-10-27T10:00:00Z',
	})
	@CreateDateColumn({
		name: 'created_at',
		comment: 'Fecha y hora de creación del post',
	})
	createdAt: Date;

	/**
	 * Fecha y hora de la última actualización del post.
	 * @type {Date}
	 * @example '2023-10-27T11:30:00Z'
	 */
	@ApiProperty({
		description: 'Fecha y hora de la última actualización del post',
		example: '2023-10-27T11:30:00Z',
	})
	@UpdateDateColumn({
		name: 'updated_at',
		comment: 'Fecha y hora de la última actualización del post',
	})
	updatedAt: Date;

	/**
	 * El perfil al que pertenece el post.
	 * @type {Profiles}
	 */
	@ApiProperty({
		description: 'El perfil al que pertenece el post',
		type: () => Profiles,
	})
	@ManyToOne(() => Profiles, (profile) => profile.post, { nullable: false })
	@JoinColumn({ name: 'profile_id' })
	profile: Profiles;

	/**
	 * Las categorías a las que pertenece el post.
	 * @type {Categories[]}
	 */
	@ApiProperty({
		description: 'Las categorías a las que pertenece el post',
		type: () => [Categories],
	})
	@ManyToMany(() => Categories, (category) => category.posts)
	@JoinTable({
		name: 'posts_categories',
		joinColumn: { name: 'post_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
	})
	categories: Categories[];
}
