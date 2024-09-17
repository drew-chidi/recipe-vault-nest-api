import { IsNotEmpty } from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  ingredients: string[];

  @IsNotEmpty()
  instructions: string;
}
