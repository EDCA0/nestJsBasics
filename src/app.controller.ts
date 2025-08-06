import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Env } from './users/env.model';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly configService: ConfigService<Env>,
	) {}

	@Get()
	getHello(): string {
		const myVar = this.configService.get<string>('MY_VAR');
		const message = this.appService.getHello();
		return `${message} ${myVar}`;
	}
}
