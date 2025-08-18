// Se importa la función de validación y los decoradores
import { plainToClass } from 'class-transformer';
import { IsString, IsNumber, IsOptional, validateSync } from 'class-validator';

// Se crea el DTO para las variables de entorno
class EnvironmentVariables {
	@IsString()
	POSTGRES_HOST: string;

	@IsNumber()
	POSTGRES_PORT: number;

	@IsString()
	POSTGRES_USER: string;

	@IsString()
	POSTGRES_PASSWORD: string;

	@IsString()
	POSTGRES_DB: string;

	@IsString()
	JWT_SECRET: string;

	@IsNumber()
	@IsOptional()
	PORT: number = 3000;
}

// Se crea la función que será usada por NestJS para la validación
export function validate(config: Record<string, unknown>) {
	// Convierte el objeto plano de configuración a una instancia de la clase DTO
	const validatedConfig = plainToClass(
		EnvironmentVariables,
		config,
		{ enableImplicitConversion: true }, // Permite que class-transformer convierta los tipos
	);

	// Valida la instancia de la clase
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	// Si hay errores, lanza una excepción que detiene la aplicación
	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	// Devuelve el objeto validado
	return validatedConfig;
}
