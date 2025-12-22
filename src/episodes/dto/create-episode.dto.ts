import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEpisodeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    @IsNotEmpty()
    episodeNumber: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsNotEmpty()
    duration: number;

    @IsInt()
    @IsNotEmpty()
    seasonId: number;
}
