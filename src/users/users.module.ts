import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profiles } from 'src/profiles/entities/profiles.entity';
import { UsersService } from 'src/users/users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/users.entity';
import { ProfilesModule } from 'src/profiles/profile.module';
import { Posts } from 'src/post/entities/posts.entity';
import { PostModule } from 'src/post/post.module';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Profiles, Posts]), ProfilesModule, PostModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
