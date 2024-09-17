import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './schemas/recipe.schema';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<Recipe>) {}

  async getAllRecipes(page: number, limit: number) {
    const recipes = await this.recipeModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const count = await this.recipeModel.countDocuments();
    return {
      data: recipes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async getRecipeById(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return recipe;
  }

  async createRecipe(recipeData: Partial<Recipe>, imageUrl: string) {
    const newRecipe = new this.recipeModel({ ...recipeData, image: imageUrl });
    return newRecipe.save();
  }

  async updateRecipe(
    id: string,
    recipeData: Partial<Recipe>,
    imageUrl?: string,
  ) {
    const updatedRecipe = await this.recipeModel.findByIdAndUpdate(
      id,
      { ...recipeData, ...(imageUrl && { image: imageUrl }) },
      { new: true },
    );
    if (!updatedRecipe) {
      throw new NotFoundException('Recipe not found');
    }
    return updatedRecipe;
  }

  async deleteRecipe(id: string) {
    const deletedRecipe = await this.recipeModel.findByIdAndDelete(id);
    if (!deletedRecipe) {
      throw new NotFoundException('Recipe not found');
    }
    return deletedRecipe;
  }
}
