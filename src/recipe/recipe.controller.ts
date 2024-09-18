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
  HttpException,
  HttpStatus,
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
    try {
      return this.recipeService.getAllRecipes(page, limit);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch recipes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getRecipeById(@Param('id') id: string) {
    try {
      return this.recipeService.getRecipeById(id);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Recipe not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createRecipe(
    @Body() createRecipeDto: CreateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let imageUrl = '';

      if (file && file?.buffer) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: 'image' }, (error, result) => {
              if (error) {
                return reject(
                  new HttpException(
                    'Image upload failed',
                    HttpStatus.BAD_REQUEST,
                  ),
                );
              } else {
                resolve(result);
              }
            })
            .end(file?.buffer);
        });
        imageUrl = (result as any).secure_url;
      }

      return await this.recipeService.createRecipe(createRecipeDto, imageUrl);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Error creating recipe',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: CreateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let imageUrl = '';

      if (file && file?.buffer) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: 'image' }, (error, result) => {
              if (error) {
                return reject(
                  new HttpException(
                    'Image upload failed',
                    HttpStatus.BAD_REQUEST,
                  ),
                );
              }
              resolve(result);
            })
            .end(file.buffer);
        });
        imageUrl = (result as any).secure_url;
      }

      return await this.recipeService.updateRecipe(
        id,
        updateRecipeDto,
        imageUrl || undefined,
      );
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Error updating recipe',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    try {
      return this.recipeService.deleteRecipe(id);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Error deleting recipe',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
