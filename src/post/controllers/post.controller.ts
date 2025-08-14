/**
 * @fileoverview Controlador para gestionar las publicaciones (posts).
 * Este archivo define los endpoints para la creación, lectura, actualización y eliminación de posts.
 * Utiliza decoradores de NestJS para definir rutas y Swagger para documentar la API.
 * @module posts/controllers/post.controller
 */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/auth/models/payload.model';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { Posts } from '../entities/posts.entity';
import { PostService } from '../services/post.service';

/**
 * Controlador que maneja las rutas relacionadas con los posts.
 * @class PostController
 */
@ApiTags('posts')
@ApiBearerAuth()
@Controller('post')
export class PostController {
	/**
	 * Inyecta el servicio de posts.
	 * @param {PostService} postService - Servicio para la lógica de negocio de los posts.
	 */
	constructor(private readonly postService: PostService) {} /**
	 * Crea una nueva publicación.
	 * @param {CreatePostDto} createPostDto - Datos de la publicación a crear.
	 * @param {Request} request - Objeto de solicitud, utilizado para obtener el ID del usuario autenticado.
	 * @returns {Promise<Posts>} La publicación creada.
	 */

	@Post()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Crea una nueva publicación' })
	@ApiResponse({
		status: 201,
		description: 'La publicación ha sido creada exitosamente.',
		type: Posts,
	})
	@ApiResponse({
		status: 400,
		description: 'Solicitud incorrecta. Puede deberse a IDs de categorías inválidos o a un error general.',
	})
	@ApiResponse({
		status: 404,
		description: 'No se encontró el perfil de usuario.',
	})
	@ApiResponse({
		status: 401,
		description: 'Acceso no autorizado.',
	})
	@ApiBody({
		type: CreatePostDto,
		description: 'Datos necesarios para crear una nueva publicación.',
	})
	create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
		const payload = request.user as Payload;
		const profileId = payload.sub;
		return this.postService.Create(createPostDto, profileId);
	} /**
	 * Obtiene todas las publicaciones.
	 * @returns {Promise<Posts[]>} Una lista de todas las publicaciones.
	 */

	@Get()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Obtiene todas las publicaciones' })
	@ApiResponse({
		status: 200,
		description: 'Devuelve una lista de todas las publicaciones.',
		type: [Posts],
	})
	@ApiResponse({
		status: 400,
		description: 'Error al obtener las publicaciones.',
	})
	@ApiResponse({ status: 401, description: 'Acceso no autorizado.' })
	findAll() {
		return this.postService.FindAll();
	} /**
	 * Obtiene una publicación específica por su ID.
	 * @param {number} id - El ID de la publicación a buscar.
	 * @returns {Promise<Posts>} La publicación encontrada.
	 */

	@Get(':id')
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Obtiene una publicación por ID' })
	@ApiResponse({
		status: 200,
		description: 'Devuelve una publicación específica.',
		type: Posts,
	})
	@ApiResponse({
		status: 400,
		description: 'Error al buscar la publicación.',
	})
	@ApiResponse({
		status: 404,
		description: 'Publicación no encontrada.',
	})
	@ApiResponse({ status: 401, description: 'Acceso no autorizado.' })
	@ApiParam({
		name: 'id',
		type: Number,
		description: 'ID de la publicación a buscar.',
	})
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.postService.FindOneById(id);
	} /**
	 * Actualiza una publicación por su ID.
	 * @param {number} id - El ID de la publicación a actualizar.
	 * @param {UpdatePostDto} updatePostDto - Datos para actualizar la publicación.
	 * @returns {Promise<Posts>} La publicación actualizada.
	 */

	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Actualiza una publicación por ID' })
	@ApiResponse({
		status: 200,
		description: 'La publicación ha sido actualizada exitosamente.',
		type: Posts,
	})
	@ApiResponse({
		status: 400,
		description: 'Error al actualizar la publicación.',
	})
	@ApiResponse({
		status: 404,
		description: 'Publicación no encontrada.',
	})
	@ApiResponse({ status: 401, description: 'Acceso no autorizado.' })
	@ApiParam({
		name: 'id',
		type: Number,
		description: 'ID de la publicación a actualizar.',
	})
	@ApiBody({
		type: UpdatePostDto,
		description: 'Datos de la publicación para actualizar.',
	})
	update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
		return this.postService.Update(id, updatePostDto);
	} /**
	 * Elimina una publicación por su ID.
	 * @param {number} id - El ID de la publicación a eliminar.
	 * @returns {void}
	 */

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Elimina una publicación por ID' })
	@ApiResponse({
		status: 204,
		description: 'La publicación ha sido eliminada exitosamente.',
	})
	@ApiResponse({
		status: 400,
		description: 'Error al eliminar la publicación.',
	})
	@ApiResponse({
		status: 404,
		description: 'Publicación no encontrada.',
	})
	@ApiResponse({ status: 401, description: 'Acceso no autorizado.' })
	@ApiParam({
		name: 'id',
		type: Number,
		description: 'ID de la publicación a eliminar.',
	})
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.postService.Delete(id);
	}
}
