import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { Users } from '../entities/user.entity';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from 'src/services/users.service';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Profile])],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
