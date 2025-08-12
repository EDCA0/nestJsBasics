import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Posts } from './posts.entity';

@Entity({ name: 'categories' })
export class Categories extends BaseEntity {
	/**
	 * Identificador único para cada categoría.
	 */
	@PrimaryGeneratedColumn({
		comment: 'Identificador único de la categoría (Clave primaria autoincremental)',
	})
	id: number;

	/**
	 * El nombre de la categoría. Debe ser único para evitar duplicados.
	 */
	@Column({
		type: 'varchar',
		length: 255,
		unique: true,
		comment: 'Nombre único de la categoría.',
	})
	name: string;

	/**
	 * Fecha y hora en que se creó el registro de la categoría.
	 */
	@CreateDateColumn({
		name: 'created_at',
		comment: 'Fecha y hora de creación del registro. Se establece automáticamente en la inserción.',
	})
	createdAt: Date;

	/**
	 * Fecha y hora de la última actualización del registro de la categoría.
	 */
	@UpdateDateColumn({
		name: 'updated_at',
		comment: 'Fecha y hora de la última actualización. Se modifica automáticamente en cada actualización.',
	})
	updatedAt: Date;

	@ManyToMany(() => Posts, (post) => post.categories)
	posts: Posts[];
}
