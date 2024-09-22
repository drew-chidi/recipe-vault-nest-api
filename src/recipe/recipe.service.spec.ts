import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { Recipe } from './schemas/recipe.schema';
import { NotFoundException } from '@nestjs/common';

const mockRecipe = {
  _id: 'validId',
  title: 'Test Recipe',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  instructions: 'Test instructions',
  image: 'http://test.com/image.jpg',
};

jest.mock('src/config/cloudinary.config', () => ({
  v2: {
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'http://test.com/newImage.jpg',
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

describe('RecipeService', () => {
  let service: RecipeService;
  let model: Model<Recipe>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getModelToken(Recipe.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    model = module.get<Model<Recipe>>(getModelToken(Recipe.name));
  });

  it('should return all recipes with pagination', async () => {
    const mockedQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([mockRecipe]),
    };

    jest
      .spyOn(model, 'find')
      .mockReturnValue(mockedQuery as unknown as Query<any, any>);
    jest
      .spyOn(model, 'countDocuments')
      .mockReturnValue(1 as unknown as Query<any, any>);

    const result = await service.getAllRecipes(1, 10);
    expect(result).toEqual({
      data: [mockRecipe],
      totalPages: 1,
      currentPage: 1,
    });
  });

  it('should return a single recipe by id', async () => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockRecipe),
    } as unknown as Query<any, any>);

    const result = await service.getRecipeById('valiId');
    expect(result).toEqual(mockRecipe);
  });

  it('should throw NotFoundException if recipe not found', async () => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as unknown as Query<any, any>);

    await expect(service.getRecipeById('invalidId')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update an existing recipe', async () => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockRecipe),
    } as unknown as Query<any, any>);

    const updatedRecipe = { ...mockRecipe, title: 'Updated Title' };

    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(updatedRecipe),
    } as unknown as Query<any, any>);

    const result = await service.updateRecipe('validId', updatedRecipe);
    expect(result).toEqual(updatedRecipe);
  });
});
