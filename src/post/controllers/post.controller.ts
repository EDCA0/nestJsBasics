import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(AuthGuard('jwt'))
	@Post()
	create(@Body() createPostDto: CreatePostDto) {
		return this.postService.Create(createPostDto);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get()
	findAll() {
		return this.postService.FindAll();
	}

	@UseGuards(AuthGuard('jwt'))
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.postService.FindOneById(id);
	}

	@UseGuards(AuthGuard('jwt'))
	@Put(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
		return this.postService.Update(id, updatePostDto);
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.postService.Delete(id);
	}
}
