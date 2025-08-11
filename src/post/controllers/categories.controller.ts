import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { CategoriesService } from '../services/categories.service';

/**
 * Controlador para gestionar las operaciones CRUD de las categorías.
 * Expone los endpoints HTTP para interactuar con el servicio de categorías.
 */
@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	/**
	 * Endpoint para crear una nueva categoría.
	 * @param createCategoryDto - DTO con los datos para la nueva categoría.
	 * @returns La categoría recién creada.
	 */
	@Post()
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoriesService.Create(createCategoryDto);
	}

	/**
	 * Endpoint para obtener todas las categorías.
	 * @returns Un array con todas las categorías.
	 */
	@Get()
	findAll() {
		return this.categoriesService.FindAll();
	}

	/**
	 * Endpoint para obtener una categoría específica por su ID.
	 * @param id - El ID de la categoría a buscar.
	 * @returns La categoría encontrada.
	 */
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		// ParseIntPipe valida que el 'id' recibido en la URL sea un número válido.
		// Si no lo es, NestJS arrojará automáticamente un BadRequestException.
		return this.categoriesService.FindOneById(id);
	}

	/**
	 * Endpoint para actualizar una categoría existente.
	 * Se utiliza PATCH porque permite actualizaciones parciales, lo cual es ideal
	 * para nuestro UpdateCategoryDto que tiene propiedades opcionales.
	 * @param id - El ID de la categoría a actualizar.
	 * @param updateCategoryDto - DTO con los campos a modificar.
	 * @returns La categoría actualizada.
	 */
	@Put(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
		return this.categoriesService.Update(id, updateCategoryDto);
	}

	/**
	 * Endpoint para eliminar una categoría por su ID.
	 * @param id - El ID de la categoría a eliminar.
	 * @returns Un objeto con un mensaje de confirmación.
	 */
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.categoriesService.Delete(id);
	}
}
