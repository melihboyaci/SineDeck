import { IsString, Length } from "class-validator";

export class CreateGenreDto {
    @IsString()
    @Length(1, 50)
    name: string;
}
