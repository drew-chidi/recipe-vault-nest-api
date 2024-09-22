import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './schemas/recipe.schema';
import cloudinary from 'src/config/cloudinary.config';

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

  async createRecipe(recipeData: Partial<Recipe>, imageUrl?: string) {
    try {
      const newRecipe = new this.recipeModel({
        ...recipeData,
        image: imageUrl,
      });
      return await newRecipe.save();
    } catch (error) {
      throw new Error(`Error creating recipe: ${error} `);
    }
  }

  async updateRecipe(
    id: string,
    recipeData: Partial<Recipe>,
    imageUrl?: string,
  ) {
    const existingRecipe = await this.recipeModel.findById(id).exec();
    if (!existingRecipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (imageUrl) {
      // Delete the old image if it exists
      if (existingRecipe.image) {
        const publicId = existingRecipe.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    } else {
      imageUrl = existingRecipe.image; // Retain the old image if no new one is provided
    }

    const updatedRecipe = await this.recipeModel
      .findByIdAndUpdate(id, { ...recipeData, image: imageUrl }, { new: true })
      .exec();
    if (!updatedRecipe) {
      throw new NotFoundException('Recipe not found');
    }
    return updatedRecipe;
  }

  async deleteRecipe(id: string) {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    // Delete the image from Cloudinary if it exists
    if (recipe.image) {
      const publicId = recipe.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    const deletedRecipe = await this.recipeModel.findByIdAndDelete(id);
    if (!deletedRecipe) {
      throw new NotFoundException('Recipe not found');
    }
    return deletedRecipe;
  }
}
