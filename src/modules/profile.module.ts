import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from 'src/controllers/profile.controller';
import { Profile } from 'src/entities/profile.entity';
import { Users } from 'src/entities/user.entity';
import { ProfileService } from 'src/services/profile.service';
import { UsersService } from 'src/services/users.service';

@Module({
	imports: [TypeOrmModule.forFeature([Profile, Users])],
	controllers: [ProfileController],
	providers: [ProfileService, UsersService],
	exports: [ProfileService],
})
export class ProfilesModule {}
