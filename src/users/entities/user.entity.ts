import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
@Index(['userEmail'])
export class Users extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'user_password',
		type: 'varchar',
		length: 255,
		comment: 'Nombre del usuario',
		select: false,
	})
	userPassword: string;

	@Column({
		name: 'user_email',
		type: 'varchar',
		length: 255,
		comment: 'Email del usuario, unico por usuario',
		unique: true,
	})
	userEmail: string;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date;
}
