import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
  providers: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
