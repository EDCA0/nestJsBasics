import { Users } from 'src/users/entities/user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('profile')
@Index(['profileEmail'])
export class Profile extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'profile_name',
		type: 'varchar',
		length: 255,
		comment: 'Nombre del usuario',
	})
	profileName: string;

	@Column({
		name: 'profile_lastname',
		type: 'varchar',
		length: 255,
		comment: 'apellido del usuario',
	})
	profileLastname: string;

	@Column({
		name: 'profile_email',
		type: 'varchar',
		length: 255,
		comment: 'Email del usuario, unico por usuario',
		unique: true,
	})
	profileEmail: string;

	@Column({
		name: 'profile_avatar',
		type: 'varchar',
		length: 300,
		comment: 'URL del avatar del usuario',
		nullable: true,
	})
	profileAvatar: string;

	@OneToOne(() => Users, {
		nullable: false,
		cascade: true,
	})
	@JoinColumn({
		name: 'user_id',
	})
	user: Users;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date;
}
