// // src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeModule } from './recipe/recipe.module';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.MONGO_URI);

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), RecipeModule],
})
export class AppModule {}
