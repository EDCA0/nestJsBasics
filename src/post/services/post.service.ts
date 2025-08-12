import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileService } from 'src/profiles/services/profile.service';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { Posts } from '../entities/posts.entity';
import { CategoriesService } from './categories.service';

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(Posts)
		private postsRepository: Repository<Posts>,
		private readonly profileService: ProfileService,
		private readonly categoryService: CategoriesService,
	) {}

	/**
	 * Encuentra todos los posts.
	 * @returns Una promesa que se resuelve con un array de posts.
	 */
	async FindAll(): Promise<Posts[]> {
		try {
			const posts = await this.postsRepository.find();
			return posts;
		} catch {
			throw new BadRequestException('Error al encontrar posts');
		}
	}

	/**
	 * Encuentra un post por su ID, incluyendo la relación con el autor.
	 * @param id El ID del post a buscar.
	 * @returns Una promesa que se resuelve con el post encontrado.
	 * @throws NotFoundException si el post no existe.
	 * @throws BadRequestException si hay un error al buscar el post.
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
	}

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
	}

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
	}

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
	}

	/**
	 * Crea un nuevo post.
	 * @param body Los datos del post a crear.
	 * @param userId El ID del usuario que crea el post.
	 * @returns Una promesa que se resuelve con el post creado, incluyendo su autor.
	 * @throws NotFoundException si el usuario no existe.
	 * @throws BadRequestException si hay un error al crear el post.
	 */
	async Create(body: CreatePostDto): Promise<Posts> {
		try {
			const idProfile = await this.profileService.JustFindId(body.profileId);
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
			// Si el usersService lanza una NotFoundException, la re-lanzamos.
			if (error instanceof NotFoundException) {
				throw new NotFoundException('El usuario no existe, no se puede crear el post');
			}
			console.log(error);
			throw new BadRequestException('Error al crear el post');
		}
	}

	/**
	 * Actualiza un post existente.
	 * @param id El ID del post a actualizar.
	 * @param changes Los cambios a aplicar.
	 * @returns Una promesa que se resuelve con el post actualizado.
	 * @throws NotFoundException si el post no existe.
	 * @throws BadRequestException si hay un error al actualizar el post.
	 */
	async Update(id: number, changes: UpdatePostDto): Promise<Posts> {
		try {
			const categoryIds = changes.categoryIds;
			// Se busca el post existente para garantizar que exista
			const post = await this.postsRepository.preload({
				id: id,
				...changes,
			});

			if (!post) {
				throw new NotFoundException(`El post con el ID ${id} no fue encontrado.`);
			}
			if (categoryIds) {
				// Usamos la función robusta que creamos para buscar y validar los IDs.
				const categories = await this.categoryService.findByIds(categoryIds);

				// 4. Reemplaza por completo la colección de categorías en la entidad Post.
				post.categories = categories;
			}
			// Se guarda el post actualizado

			return await this.postsRepository.save(post);
		} catch {
			throw new BadRequestException('Error al actualizar el post');
		}
	}

	/**
	 * Elimina un post por su ID.
	 * @param id El ID del post a eliminar.
	 * @returns Una promesa que se resuelve con un mensaje de éxito.
	 * @throws NotFoundException si el post no existe.
	 * @throws BadRequestException si hay un error al eliminar el post.
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
