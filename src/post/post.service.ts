import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(Post)
		private postsRepository: Repository<Post>,
	) {}

	/**
	 * Encuentra todos los posts.
	 * @returns Una promesa que se resuelve con un array de posts.
	 */
	async FindAll(): Promise<Post[]> {
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
	async FindOneById(id: number): Promise<Post> {
		try {
			const post = await this.postsRepository.findOne({
				where: {
					id: id,
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

	/**
	 * Crea un nuevo post.
	 * @param body Los datos del post a crear.
	 * @param userId El ID del usuario que crea el post.
	 * @returns Una promesa que se resuelve con el post creado, incluyendo su autor.
	 * @throws NotFoundException si el usuario no existe.
	 * @throws BadRequestException si hay un error al crear el post.
	 */
	async Create(body: CreatePostDto): Promise<Post> {
		try {
			const post = await this.postsRepository.save(body);
			return post;
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
	async Update(id: number, changes: UpdatePostDto): Promise<Post> {
		try {
			// Se busca el post existente para garantizar que exista
			const post = await this.FindOneById(id);

			// Se combinan los cambios con el post existente
			const updatedPost = this.postsRepository.merge(post, changes);

			// Se guarda el post actualizado
			await this.postsRepository.save(updatedPost);

			return updatedPost;
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
			await this.FindOneById(id);
			await this.postsRepository.delete(id);
			return { message: 'Post eliminado correctamente' };
		} catch {
			throw new BadRequestException('Error al eliminar el post');
		}
	}
}
