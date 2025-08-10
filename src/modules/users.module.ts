import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { UsersService } from 'src/services/users.service';
import { UsersController } from '../controllers/users.controller';
import { Users } from '../entities/user.entity';
import { ProfilesModule } from './profile.module';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Profile]), ProfilesModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
