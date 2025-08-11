import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profiles } from 'src/profiles/entities/profiles.entity';
import { ProfileService } from 'src/profiles/services/profile.service';

@Module({
	imports: [TypeOrmModule.forFeature([Profiles])],
	controllers: [],
	providers: [ProfileService],
	exports: [ProfileService],
})
export class ProfilesModule {}
