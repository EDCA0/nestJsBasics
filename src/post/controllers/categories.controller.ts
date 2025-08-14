/**
 * @fileoverview Controlador para la gestión de categorías.
 * Define los endpoints para la creación, lectura, actualización y eliminación de categorías.
 * También incluye un endpoint para obtener todos los posts asociados a una categoría.
 * Utiliza decoradores de NestJS y Swagger para la documentación de la API.
 * @module categories/controllers/categories.controller
 */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { CategoriesService } from '../services/categories.service';
import { PostService } from '../services/post.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Categories } from '../entities/category.entity';
import { Posts } from '../entities/posts.entity';

/**
 * Controlador que maneja las rutas relacionadas con las categorías.
 * @class CategoriesController
 */
@ApiTags('categories') // Define la etiqueta para agrupar los endpoints en Swagger
@Controller('categories')
export class CategoriesController {
	/**
	 * Inyecta los servicios de categorías y posts.
	 * @param {CategoriesService} categoriesService - Servicio para la lógica de negocio de las categorías.
	 * @param {PostService} postService - Servicio para la lógica de negocio de los posts.
	 */
	constructor(
		private readonly categoriesService: CategoriesService,
		private readonly postService: PostService,
	) {} /**
	 * Crea una nueva categoría.
	 * @param {CreateCategoryDto} createCategoryDto - Datos para crear la categoría.
	 * @returns {Promise<Categories>} La categoría creada.
	 */

	@ApiOperation({ summary: 'Crea una nueva categoría' })
	@ApiBody({
		type: CreateCategoryDto,
		description: 'Datos para crear una nueva categoría',
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'La categoría ha sido creada exitosamente.',
		type: Categories,
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Datos de entrada inválidos.',
	})
	@Post()
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoriesService.Create(createCategoryDto);
	} /**
	 * Obtiene todas las categorías.
	 * @returns {Promise<Categories[]>} Una lista de todas las categorías.
	 */

	@ApiOperation({ summary: 'Obtiene todas las categorías' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Se devuelven todas las categorías.',
		type: [Categories],
	})
	@Get()
	findAll() {
		return this.categoriesService.FindAll();
	} /**
	 * Obtiene una categoría por su ID.
	 * @param {number} id - El ID de la categoría a buscar.
	 * @returns {Promise<Categories>} La categoría encontrada.
	 */

	@ApiOperation({ summary: 'Obtiene una categoría por su ID' })
	@ApiParam({
		name: 'id',
		description: 'Identificador único de la categoría',
		example: 1,
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Se devuelve la categoría con el ID especificado.',
		type: Categories,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Categoría no encontrada.',
	})
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.categoriesService.FindOneById(id);
	} /**
	 * Obtiene todos los posts de una categoría específica por su ID.
	 * @param {number} id - El ID de la categoría.
	 * @returns {Promise<Posts[]>} Una lista de posts de la categoría.
	 */

	@ApiOperation({
		summary: 'Obtiene todos los posts de una categoría específica',
	})
	@ApiParam({
		name: 'id',
		description: 'Identificador único de la categoría',
		example: 1,
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Se devuelven los posts de la categoría.',
		type: [Posts],
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Categoría no encontrada.',
	})
	@Get(':id/posts')
	findByCategoryId(@Param('id', ParseIntPipe) id: number) {
		return this.postService.findByCategoryId(id);
	} /**
	 * Actualiza una categoría por su ID.
	 * @param {number} id - El ID de la categoría a actualizar.
	 * @param {UpdateCategoryDto} updateCategoryDto - Datos para actualizar la categoría.
	 * @returns {Promise<Categories>} La categoría actualizada.
	 */

	@ApiOperation({ summary: 'Actualiza una categoría existente' })
	@ApiParam({
		name: 'id',
		description: 'Identificador único de la categoría a actualizar',
		example: 1,
	})
	@ApiBody({
		type: UpdateCategoryDto,
		description: 'Datos para actualizar la categoría',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'La categoría ha sido actualizada exitosamente.',
		type: Categories,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Categoría no encontrada.',
	})
	@Put(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
		return this.categoriesService.Update(id, updateCategoryDto);
	} /**
	 * Elimina una categoría por su ID.
	 * @param {number} id - El ID de la categoría a eliminar.
	 * @returns {Promise<void>}
	 */

	@ApiOperation({ summary: 'Elimina una categoría por su ID' })
	@ApiParam({
		name: 'id',
		description: 'Identificador único de la categoría a eliminar',
		example: 1,
	})
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'La categoría ha sido eliminada exitosamente.',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Categoría no encontrada.',
	})
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.categoriesService.Delete(id);
	}
}
