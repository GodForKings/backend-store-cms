import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Authorization, FileResponse } from 'src/common';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FilesInterceptor('files', 10))
  @Authorization()
  @Post()
  async saveFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp|gif|svg\+xml)$/ }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024, message: 'Макс. 10 МБ' }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ): Promise<FileResponse[]> {
    return this.fileService.saveFiles(files, folder);
  }
}
