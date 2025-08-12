import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Categories } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Categories)
		private readonly categoriesRepository: Repository<Categories>,
	) {}

	/**
	 * Encuentra y devuelve todas las categorías.
	 * @returns Una promesa que se resuelve con un array de todas las categorías.
	 * @throws InternalServerErrorException si ocurre un error inesperado en la base de datos.
	 */
	async FindAll(): Promise<Categories[]> {
		try {
			return await this.categoriesRepository.find();
		} catch {
			throw new InternalServerErrorException('Ocurrió un error inesperado al buscar las categorías.');
		}
	}

	/**
	 * Busca una única categoría por su ID.
	 * Es el método principal para verificar la existencia de una categoría antes de cualquier operación.
	 * @param id - El identificador numérico de la categoría.
	 * @returns Una promesa que se resuelve con la entidad de la categoría encontrada.
	 * @throws NotFoundException si no se encuentra ninguna categoría con el ID proporcionado.
	 */
	async FindOneById(id: number): Promise<Categories> {
		const category = await this.categoriesRepository.findOneBy({ id });

		if (!category) {
			throw new NotFoundException(`La categoría con el ID '${id}' no fue encontrada.`);
		}
		return category;
	}

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
	}

	async findByIds(categoryIds: number[] | undefined): Promise<Categories[]> {
		if (!categoryIds || categoryIds.length === 0) {
			return [];
		}

		const categories = await this.categoriesRepository.findBy({
			id: In(categoryIds),
		});

		return categories;
	}

	/**
	 * Crea una nueva categoría en la base de datos.
	 * Valida que no exista otra categoría con el mismo nombre antes de la creación.
	 * @param body - El DTO con los datos para crear la categoría.
	 * @returns Una promesa que se resuelve con la entidad de la categoría recién creada.
	 * @throws ConflictException si ya existe una categoría con el mismo nombre.
	 * @throws InternalServerErrorException si ocurre un error inesperado durante el guardado.
	 */
	async Create(body: CreateCategoryDto): Promise<Categories> {
		const { name } = body;

		// Verificación de conflicto: ¿Ya existe una categoría con este nombre?
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
	}

	/**
	 * Actualiza una categoría existente.
	 * Verifica que la categoría a actualizar exista.
	 * Si se cambia el nombre, verifica que el nuevo nombre no esté ya en uso por otra categoría.
	 * @param id - El ID de la categoría a actualizar.
	 * @param changes - El DTO con los datos a actualizar.
	 * @returns Una promesa que se resuelve con la entidad de la categoría actualizada.
	 * @throws NotFoundException si la categoría con el ID especificado no existe.
	 * @throws ConflictException si el nuevo nombre ya está en uso por otra categoría.
	 */
	async Update(id: number, changes: UpdateCategoryDto): Promise<Categories> {
		// 1. Asegurarnos de que la categoría que queremos actualizar realmente existe.
		// Este método ya lanza un NotFoundException si no la encuentra.
		const categoryToUpdate = await this.FindOneById(id);

		// 2. Si se está intentando cambiar el nombre, debemos verificar que no entre en conflicto con otro existente.
		if (changes.name) {
			const categoryWithNewName = await this.categoriesRepository.findOne({
				where: { name: changes.name },
			});

			// Si encontramos una categoría con el nuevo nombre, Y NO es la misma que estamos actualizando,
			// entonces hay un conflicto.
			if (categoryWithNewName && categoryWithNewName.id !== id) {
				throw new ConflictException(`El nombre '${changes.name}' ya está en uso por otra categoría.`);
			}
		}

		// 3. Fusionamos los cambios en la entidad encontrada y guardamos.
		const updatedCategory = this.categoriesRepository.merge(categoryToUpdate, changes);
		return this.categoriesRepository.save(updatedCategory);
	}

	/**
	 * Elimina una categoría de la base de datos.
	 * @param id - El ID de la categoría a eliminar.
	 * @returns Un objeto confirmando que la eliminación fue exitosa.
	 * @throws NotFoundException si la categoría no existe.
	 */
	async Delete(id: number): Promise<{ message: string }> {
		// Si no encuentra la categoría, lanzará NotFoundException y la ejecución se detendrá aquí.
		await this.FindOneById(id);

		// Si el código llega hasta aquí, significa que la categoría existe y podemos proceder a eliminarla.
		await this.categoriesRepository.delete(id);

		return { message: `Categoría con ID '${id}' eliminada correctamente.` };
	}
}
