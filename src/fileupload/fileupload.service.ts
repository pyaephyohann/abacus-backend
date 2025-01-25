import { BadRequestException, Injectable } from '@nestjs/common';
import { firebaseAdmin } from 'src/config/firebase-admin.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly bucket = firebaseAdmin.storage().bucket();

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) throw new BadRequestException('A File is required!!');
      const filename = `${uuidv4()}-${file.originalname}`;
      const fileUpload = this.bucket.file(filename);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => reject(error));
        blobStream.on('finish', async () => {
          // Make the file public
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileUpload.name}`;
          resolve(publicUrl);
        });
        blobStream.end(file.buffer);
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Oops! Cannot Upload file at this time!!');
    }
  }
}
