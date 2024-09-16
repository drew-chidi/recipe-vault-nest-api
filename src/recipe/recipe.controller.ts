import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as cloudinary from 'cloudinary';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async getAllRecipes(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.recipeService.getAllRecipes(page, limit);
  }

  @Get(':id')
  async getRecipeById(@Param('id') id: string) {
    return this.recipeService.getRecipeById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createRecipe(@Body() body, @UploadedFile() file) {
    let imageUrl = '';

    if (file) {
      const result = await cloudinary.v2.uploader.upload(file.path);
      imageUrl = result.secure_url;
    }

    return this.recipeService.createRecipe(body, imageUrl);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateRecipe(
    @Param('id') id: string,
    @Body() body,
    @UploadedFile() file,
  ) {
    let imageUrl = '';

    if (file) {
      const result = await cloudinary.v2.uploader.upload(file.path);
      imageUrl = result.secure_url;
    }

    return this.recipeService.updateRecipe(id, body, imageUrl);
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    return this.recipeService.deleteRecipe(id);
  }
}
