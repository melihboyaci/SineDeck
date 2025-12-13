import { IsInt, IsOptional, IsString, IsUrl, Length, Max, Min } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @Length(1, 200)
    title: string;

    @IsString()
    @Length(1, 100)
    director: string;

    @IsInt()
    @Min(1888) //ilk film 1888de yapıldı
    @Max(2026)
    releaseYear: number;

    @IsOptional()
    @IsUrl()
    posterUrl?: string;
}
