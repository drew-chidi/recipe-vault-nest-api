import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Recipe extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  ingredients: string[];

  @Prop({ required: true })
  instructions: string;

  @Prop()
  image: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
