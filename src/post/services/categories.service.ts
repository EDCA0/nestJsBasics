/**
 * @fileoverview Servicio que gestiona la lógica de negocio para las categorías.
 * Proporciona métodos para buscar, crear, actualizar y eliminar categorías en la base de datos.
 * Utiliza TypeORM para interactuar con el repositorio de la entidad Categories.
 * @module categories/services/categories.service
 */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Categories } from '../entities/category.entity';

/**
 * Servicio que contiene la lógica de negocio para la gestión de categorías.
 * @class CategoriesService
 */
@Injectable()
export class CategoriesService {
	/**
	 * Inyecta el repositorio de la entidad Categories.
	 * @param {Repository<Categories>} categoriesRepository - Repositorio de TypeORM para la entidad Categories.
	 */
	constructor(
		@InjectRepository(Categories)
		private readonly categoriesRepository: Repository<Categories>,
	) {} /**
	 * Busca y devuelve todas las categorías existentes.
	 * @returns {Promise<Categories[]>} Una promesa que resuelve con un arreglo de todas las categorías.
	 * @throws {InternalServerErrorException} Si ocurre un error inesperado al buscar en la base de datos.
	 */

	async FindAll(): Promise<Categories[]> {
		try {
			return await this.categoriesRepository.find();
		} catch {
			throw new InternalServerErrorException('Ocurrió un error inesperado al buscar las categorías.');
		}
	} /**
	 * Busca una categoría por su identificador único.
	 * @param {number} id - El ID de la categoría a buscar.
	 * @returns {Promise<Categories>} Una promesa que resuelve con la categoría encontrada.
	 * @throws {NotFoundException} Si la categoría con el ID proporcionado no se encuentra.
	 */

	async FindOneById(id: number): Promise<Categories> {
		const category = await this.categoriesRepository.findOneBy({ id });

		if (!category) {
			throw new NotFoundException(`La categoría con el ID '${id}' no fue encontrada.`);
		}
		return category;
	} /**
	 * Busca solo el ID de una categoría.
	 * Este método es menos costoso que `FindOneById` ya que solo selecciona el campo 'id'.
	 * @param {number} id - El ID de la categoría a buscar.
	 * @returns {Promise<Categories>} Una promesa que resuelve con un objeto que contiene solo el ID de la categoría.
	 * @throws {NotFoundException} Si la categoría no existe.
	 * @throws {BadRequestException} Si ocurre un error inesperado durante la búsqueda.
	 */

	async JustFindId(id: number): Promise<Categories> {
		try {
			const category = await this.categoriesRepository.findOne({
				select: {
					id: true,
				},
				where: {
					id: id,
				},
			});

			if (category === null) {
				throw new NotFoundException('La categoria no existe');
			}

			return category;
		} catch {
			throw new BadRequestException('Error al encontrar La categoria');
		}
	} /**
	 * Busca múltiples categorías por un arreglo de IDs.
	 * @param {number[]} categoryIds - Un arreglo de IDs de categorías a buscar.
	 * @returns {Promise<Categories[]>} Una promesa que resuelve con un arreglo de las categorías encontradas.
	 */

	async findByIds(categoryIds: number[] | undefined): Promise<Categories[]> {
		if (!categoryIds || categoryIds.length === 0) {
			return [];
		}

		const categories = await this.categoriesRepository.findBy({
			id: In(categoryIds),
		});

		return categories;
	} /**
	 * Crea una nueva categoría.
	 * @param {CreateCategoryDto} body - El DTO con los datos para la nueva categoría.
	 * @returns {Promise<Categories>} Una promesa que resuelve con la categoría recién creada.
	 * @throws {ConflictException} Si ya existe una categoría con el mismo nombre.
	 * @throws {InternalServerErrorException} Si ocurre un error al guardar la categoría en la base de datos.
	 */

	async Create(body: CreateCategoryDto): Promise<Categories> {
		const { name } = body; // Verificación de conflicto: ¿Ya existe una categoría con este nombre?

		const existingCategory = await this.categoriesRepository.findOne({
			where: { name },
		});

		if (existingCategory) {
			// Lanzamos un error 409 Conflict, que es semánticamente más correcto
			// que un BadRequest para recursos duplicados.
			throw new ConflictException(`Ya existe una categoría con el nombre '${name}'.`);
		}

		try {
			const newCategory = this.categoriesRepository.create(body);
			return await this.categoriesRepository.save(newCategory);
		} catch {
			// Capturamos cualquier otro error que pueda ocurrir durante el guardado.
			throw new InternalServerErrorException('No se pudo crear la categoría. Por favor, revise los logs del servidor.');
		}
	} /**
	 * Actualiza una categoría existente por su ID.
	 * @param {number} id - El ID de la categoría a actualizar.
	 * @param {UpdateCategoryDto} changes - El DTO con los campos a actualizar.
	 * @returns {Promise<Categories>} Una promesa que resuelve con la categoría actualizada.
	 * @throws {NotFoundException} Si la categoría con el ID proporcionado no se encuentra.
	 * @throws {ConflictException} Si el nuevo nombre de la categoría ya está en uso por otra categoría.
	 */

	async Update(id: number, changes: UpdateCategoryDto): Promise<Categories> {
		// 1. Asegurarnos de que la categoría que queremos actualizar realmente existe.
		// Este método ya lanza un NotFoundException si no la encuentra.
		const categoryToUpdate = await this.FindOneById(id); // 2. Si se está intentando cambiar el nombre, debemos verificar que no entre en conflicto con otro existente.

		if (changes.name) {
			const categoryWithNewName = await this.categoriesRepository.findOne({
				where: { name: changes.name },
			}); // Si encontramos una categoría con el nuevo nombre, Y NO es la misma que estamos actualizando,
			// entonces hay un conflicto.

			if (categoryWithNewName && categoryWithNewName.id !== id) {
				throw new ConflictException(`El nombre '${changes.name}' ya está en uso por otra categoría.`);
			}
		} // 3. Fusionamos los cambios en la entidad encontrada y guardamos.

		const updatedCategory = this.categoriesRepository.merge(categoryToUpdate, changes);
		return this.categoriesRepository.save(updatedCategory);
	} /**
	 * Elimina una categoría por su ID.
	 * @param {number} id - El ID de la categoría a eliminar.
	 * @returns {Promise<{ message: string }>} Una promesa que resuelve con un mensaje de confirmación de la eliminación.
	 * @throws {NotFoundException} Si la categoría con el ID proporcionado no se encuentra.
	 */

	async Delete(id: number): Promise<{ message: string }> {
		// Si no encuentra la categoría, lanzará NotFoundException y la ejecución se detendrá aquí.
		await this.FindOneById(id); // Si el código llega hasta aquí, significa que la categoría existe y podemos proceder a eliminarla.

		await this.categoriesRepository.delete(id);

		return { message: `Categoría con ID '${id}' eliminada correctamente.` };
	}
}
