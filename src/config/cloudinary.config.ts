// import * as cloudinary from 'cloudinary';

// export const CloudinaryProvider = {
//   provide: 'Cloudinary',
//   useFactory: (): void => {
//     cloudinary.v2.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//     });
//   },
// };

// import { v2 as cloudinary } from 'cloudinary';
// import { ConfigService } from '@nestjs/config';
// import { Provider } from '@nestjs/common';

// export const CloudinaryProvider: Provider = {
//   provide: 'CLOUDINARY',
//   useFactory: (configService: ConfigService) => {
//     cloudinary.config({
//       cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
//       api_key: configService.get('CLOUDINARY_API_KEY'),
//       api_secret: configService.get('CLOUDINARY_API_SECRET'),
//     });
//     return cloudinary;
//   },
//   inject: [ConfigService],
// };

import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables from .env file
dotenvConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
