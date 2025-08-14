/**
 * @fileoverview Servicio que gestiona la lógica de negocio para los posts.
 * Proporciona métodos para buscar, crear, actualizar y eliminar posts.
 * Utiliza TypeORM para interactuar con el repositorio de la entidad Posts y otros servicios para la validación.
 * @module posts/services/post.service
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileService } from 'src/profiles/services/profile.service';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { Posts } from '../entities/posts.entity';
import { CategoriesService } from './categories.service';

/**
 * Servicio que contiene la lógica de negocio para la gestión de posts.
 * @class PostService
 */
@Injectable()
export class PostService {
	/**
	 * Inyecta las dependencias necesarias: el repositorio de Posts, el servicio de Perfiles y el servicio de Categorías.
	 * @param {Repository<Posts>} postsRepository - Repositorio de TypeORM para la entidad Posts.
	 * @param {ProfileService} profileService - Servicio para la lógica de negocio de los perfiles.
	 * @param {CategoriesService} categoryService - Servicio para la lógica de negocio de las categorías.
	 */
	constructor(
		@InjectRepository(Posts)
		private postsRepository: Repository<Posts>,
		private readonly profileService: ProfileService,
		private readonly categoryService: CategoriesService,
	) {} /**
	 * Busca y devuelve todas las publicaciones existentes.
	 * @returns {Promise<Posts[]>} Una promesa que resuelve con un arreglo de todas las publicaciones.
	 * @throws {BadRequestException} Si ocurre un error al buscar en la base de datos.
	 */

	async FindAll(): Promise<Posts[]> {
		try {
			const posts = await this.postsRepository.find();
			return posts;
		} catch {
			throw new BadRequestException('Error al encontrar posts');
		}
	} /**
	 * Busca una publicación por su ID con sus relaciones.
	 * @param {number} id - El ID de la publicación a buscar.
	 * @returns {Promise<Posts>} Una promesa que resuelve con la publicación encontrada.
	 * @throws {NotFoundException} Si la publicación con el ID proporcionado no se encuentra.
	 * @throws {BadRequestException} Si ocurre un error inesperado durante la búsqueda.
	 */

	async FindOneById(id: number): Promise<Posts> {
		try {
			const post = await this.postsRepository.findOne({
				where: {
					id: id,
				},
				relations: {
					profile: {
						userId: true,
					},
					categories: true,
				},
			});

			if (!post) {
				throw new NotFoundException('El post no existe');
			}

			return post;
		} catch {
			throw new BadRequestException('Error al encontrar el post');
		}
	} /**
	 * Busca solo el ID de una publicación.
	 * Este método es útil para validar la existencia de un post de manera eficiente.
	 * @param {number} id - El ID de la publicación a buscar.
	 * @returns {Promise<Posts>} Una promesa que resuelve con un objeto que contiene solo el ID de la publicación.
	 * @throws {NotFoundException} Si la publicación no existe.
	 * @throws {BadRequestException} Si ocurre un error inesperado durante la búsqueda.
	 */

	async JustFindId(id: number): Promise<Posts> {
		try {
			const post = await this.postsRepository.findOne({
				select: {
					id: true,
				},
				where: {
					id: id,
				},
			});

			if (post === null) {
				throw new NotFoundException('El post no existe');
			}

			return post;
		} catch {
			throw new BadRequestException('Error al encontrar post');
		}
	} /**
	 * Busca todas las publicaciones de un perfil específico.
	 * @param {number} id - El ID del perfil.
	 * @returns {Promise<Posts[]>} Una promesa que resuelve con un arreglo de publicaciones del perfil.
	 * @throws {NotFoundException} Si el perfil no tiene posts.
	 * @throws {BadRequestException} Si ocurre un error inesperado durante la búsqueda.
	 */

	async FindAllByProfile(id: number): Promise<Posts[]> {
		try {
			const profileId = await this.profileService.JustFindId(id);

			const posts = await this.postsRepository.find({
				select: {
					id: true,
					title: true,
					profile: {
						id: true,
						userId: {
							id: true,
							userEmail: true,
						},
					},
					categories: {
						id: true,
						name: true,
					},
				},
				where: {
					profile: profileId,
				},
				relations: {
					profile: {
						userId: true,
					},
					categories: true,
				},
			});

			if (posts === null) {
				throw new NotFoundException('El post no existe');
			}

			return posts;
		} catch {
			throw new BadRequestException('Error al encontrar el post');
		}
	} /**
	 * Busca todas las publicaciones asociadas a una categoría específica.
	 * @param {number} id - El ID de la categoría.
	 * @returns {Promise<Posts[]>} Una promesa que resuelve con un arreglo de posts de la categoría.
	 * @throws {NotFoundException} Si la categoría no existe o si no hay posts asociados.
	 * @throws {BadRequestException} Si ocurre un error inesperado durante la búsqueda.
	 */

	async findByCategoryId(id: number): Promise<Posts[]> {
		try {
			const category = await this.categoryService.JustFindId(id);

			const posts = await this.postsRepository.find({
				where: {
					categories: category,
				},
				relations: {
					profile: {
						userId: true,
					},
					categories: true,
				},
			});

			if (posts === null) {
				throw new NotFoundException('El post no existe');
			}

			return posts;
		} catch {
			throw new BadRequestException('Error al encontrar el post');
		}
	} /**
	 * Crea una nueva publicación.
	 * Realiza una validación de los IDs de categorías y asocia el post con el perfil del usuario.
	 * @param {CreatePostDto} body - El DTO con los datos para la nueva publicación.
	 * @param {number} profileId - El ID del perfil al que pertenece el post.
	 * @returns {Promise<Posts>} La publicación recién creada.
	 * @throws {BadRequestException} Si los IDs de categorías no son válidos o si ocurre un error al crear el post.
	 */

	async Create(body: CreatePostDto, profileId: number): Promise<Posts> {
		try {
			const idProfile = await this.profileService.JustFindId(profileId);
			const categoryIds = await this.categoryService.findByIds(body.categoryIds);

			if (body.categoryIds?.length !== categoryIds.length) {
				throw new BadRequestException('Ids no validas o no encontradas');
			}

			const post = await this.postsRepository.save({
				...body,
				profile: idProfile,
				categories: categoryIds,
			});

			return this.FindOneById(post.id);
		} catch (error) {
			console.log(error);
			throw new BadRequestException('Error al crear el post');
		}
	} /**
	 * Actualiza una publicación existente.
	 * @param {number} id - El ID de la publicación a actualizar.
	 * @param {UpdatePostDto} changes - El DTO con los campos a actualizar.
	 * @returns {Promise<Posts>} La publicación actualizada.
	 * @throws {NotFoundException} Si la publicación con el ID proporcionado no se encuentra.
	 * @throws {BadRequestException} Si ocurre un error inesperado durante la actualización.
	 */

	async Update(id: number, changes: UpdatePostDto): Promise<Posts> {
		try {
			const categoryIds = changes.categoryIds; // Se busca el post existente para garantizar que exista
			const post = await this.postsRepository.preload({
				id: id,
				...changes,
			});

			if (!post) {
				throw new NotFoundException(`El post con el ID ${id} no fue encontrado.`);
			}
			if (categoryIds) {
				// Usamos la función robusta que creamos para buscar y validar los IDs.
				const categories = await this.categoryService.findByIds(categoryIds); // 4. Reemplaza por completo la colección de categorías en la entidad Post.

				post.categories = categories;
			} // Se guarda el post actualizado
			return await this.postsRepository.save(post);
		} catch {
			throw new BadRequestException('Error al actualizar el post');
		}
	} /**
	 * Elimina una publicación por su ID.
	 * @param {number} id - El ID de la publicación a eliminar.
	 * @returns {Promise<object>} Una promesa que resuelve con un objeto de confirmación.
	 * @throws {BadRequestException} Si el post no se encuentra o si ocurre un error al eliminarlo.
	 */

	async Delete(id: number): Promise<object> {
		try {
			// Validamos si el post existe antes de intentar eliminarlo
			await this.JustFindId(id);
			await this.postsRepository.delete(id);
			return { message: 'Post eliminado correctamente' };
		} catch {
			throw new BadRequestException('Error al eliminar el post');
		}
	}
}
