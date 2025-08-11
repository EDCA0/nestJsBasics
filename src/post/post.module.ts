import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { ProfilesModule } from 'src/profiles/profile.module';

@Module({
	imports: [TypeOrmModule.forFeature([Posts]), ProfilesModule],
	controllers: [PostController],
	providers: [PostService],
	exports: [PostService],
})
export class PostModule {}
