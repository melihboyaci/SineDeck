import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSeasonDto {
    @IsInt()
    @IsNotEmpty()
    seasonNumber: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsNotEmpty()
    seriesId: number;
}
