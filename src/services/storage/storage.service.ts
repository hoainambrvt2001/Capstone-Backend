import { Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import { StoredImage } from "src/utils/constants";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
    this.storage = new Storage({
        projectId: this.configService.get<string>(
          'PROJECT_ID'
        ),
        credentials: {
            client_email: this.configService.get<string>(
              'CLIENT_EMAIL'
          ),
            private_key: this.configService.get<string>(
            'PRIVATE_KEY'
          ),
        },
    });

    this.bucket = this.configService.get<string>(
      'STORAGE_MEDIA_BUCKET',
    );
  }

  async save(
    folderPath: string,
    fileOriginalName: string,
    fileBuffer: Buffer,
  ) {
    return new Promise<StoredImage>((resolve, reject) => {
      const blob = this.storage.bucket(this.bucket).file(folderPath + fileOriginalName);
      const blobStream = blob.createWriteStream();
      blobStream.on('error', err => {
        reject(err)
      });
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${blob.name}`;
        resolve({
          name: fileOriginalName,
          url: publicUrl,
        })
      });
      blobStream.end(fileBuffer);
    })
  }
}