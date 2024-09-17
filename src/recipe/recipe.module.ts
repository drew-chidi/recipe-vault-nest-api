import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    ConfigModule.forRoot(),
  ],
  providers: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
