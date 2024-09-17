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
import { CreateRecipeDto } from './dto/create-recipe.dto';
import cloudinary from 'src/config/cloudinary.config';

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
  async createRecipe(
    @Body() createRecipeDto: CreateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl = '';

    if (file) {
      const result = await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              throw new Error('Error uploading image');
            } else {
              resolve(result);
            }
          })
          .end(file.buffer);
      });
      imageUrl = (result as any).secure_url;
    }

    return this.recipeService.createRecipe(createRecipeDto, imageUrl);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: CreateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl = '';

    if (file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          })
          .end(file.buffer);
      });
      imageUrl = (result as any).secure_url;
    }

    return this.recipeService.updateRecipe(
      id,
      updateRecipeDto,
      imageUrl || undefined,
    );
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    return this.recipeService.deleteRecipe(id);
  }
}
