/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import * as ToStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );
      ToStream(file.buffer).pipe(upload);
    });
  }
}
