import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { ProfileService } from 'src/profiles/profile.service';

@Module({
	imports: [TypeOrmModule.forFeature([Profile])],
	controllers: [],
	providers: [ProfileService],
	exports: [ProfileService],
})
export class ProfilesModule {}
