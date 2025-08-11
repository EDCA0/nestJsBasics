import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../dto';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	create(@Body() createPostDto: CreatePostDto) {
		return this.postService.Create(createPostDto);
	}

	@Get()
	findAll() {
		return this.postService.FindAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.postService.FindOneById(id);
	}

	@Put(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
		return this.postService.Update(id, updatePostDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.postService.Delete(id);
	}
}
