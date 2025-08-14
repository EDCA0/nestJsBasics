import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { CreatePostDto, UpdatePostDto } from '../dto';
import { PostService } from '../services/post.service';
import { Payload } from 'src/auth/models/payload.model';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(AuthGuard('jwt'))
	@Post()
	create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
		const payload = request.user as Payload;

		const profileId = payload.sub;

		return this.postService.Create(createPostDto, profileId);
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
