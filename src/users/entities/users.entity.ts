import { Profiles } from 'src/profiles/entities/profiles.entity';
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

	@OneToOne(() => Profiles, (profile) => profile.userId)
	profile: Profiles;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date;

	@BeforeInsert()
	async hashPassword() {
		this.userPassword = await bcrypt.hash(this.userPassword, 10);
	}
}
