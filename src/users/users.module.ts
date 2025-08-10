import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/profile.entity';
import { UsersService } from 'src/users/users.service';
import { UsersController } from './users.controller';
import { Users } from './user.entity';
import { ProfilesModule } from 'src/profiles/profile.module';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Profile]), ProfilesModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
