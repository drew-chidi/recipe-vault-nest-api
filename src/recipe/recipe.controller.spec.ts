// import { Test, TestingModule } from '@nestjs/testing';
// import { RecipeController } from './recipe.controller';

// describe('RecipeController', () => {
//   let controller: RecipeController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [RecipeController],
//     }).compile();

//     controller = module.get<RecipeController>(RecipeController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { NotFoundException } from '@nestjs/common';

const mockRecipe = {
  _id: 'recipeId',
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

const mockRecipeService = {
  getAllRecipes: jest.fn().mockResolvedValue({
    data: [mockRecipe],
    totalPages: 1,
    currentPage: 1,
  }),
  getRecipeById: jest.fn().mockResolvedValue(mockRecipe),
  createRecipe: jest.fn().mockResolvedValue(mockRecipe),
  updateRecipe: jest.fn().mockResolvedValue(mockRecipe),
  deleteRecipe: jest.fn().mockResolvedValue(mockRecipe),
};

describe('RecipeController', () => {
  let controller: RecipeController;
  let service: RecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
          useValue: mockRecipeService,
        },
      ],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
    service = module.get<RecipeService>(RecipeService);
  });

  it('should get all recipes', async () => {
    const result = await controller.getAllRecipes(1, 10);
    expect(result).toEqual({
      data: [mockRecipe],
      totalPages: 1,
      currentPage: 1,
    });
  });

  it('should get a recipe by id', async () => {
    const result = await controller.getRecipeById('recipeId');
    expect(result).toEqual(mockRecipe);
  });

  it('should create a new recipe', async () => {
    const result = await controller.createRecipe(mockRecipe, null);
    expect(result).toEqual(mockRecipe);
  });

  it('should update a recipe', async () => {
    const result = await controller.updateRecipe('recipeId', mockRecipe, null);
    expect(result).toEqual(mockRecipe);
  });

  it('should delete a recipe', async () => {
    const result = await controller.deleteRecipe('recipeId');
    expect(result).toEqual(mockRecipe);
  });

  it('should throw NotFoundException for missing recipe', async () => {
    jest
      .spyOn(service, 'getRecipeById')
      .mockRejectedValueOnce(new NotFoundException());
    await expect(controller.getRecipeById('invalidId')).rejects.toThrow(
      NotFoundException,
    );
  });
});
