import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from 'src/profiles/profile.module';
import { CategoriesController } from './controllers/categories.controller';
import { PostController } from './controllers/post.controller';
import { Categories } from './entities/category.entity';
import { Posts } from './entities/posts.entity';
import { CategoriesService } from './services/categories.service';
import { PostService } from './services/post.service';

@Module({
	imports: [TypeOrmModule.forFeature([Posts, Categories]), ProfilesModule],
	controllers: [PostController, CategoriesController],
	providers: [PostService, CategoriesService],
	exports: [PostService, CategoriesService],
})
export class PostModule {}
