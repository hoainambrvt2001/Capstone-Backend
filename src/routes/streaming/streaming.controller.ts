import { Get, Controller, Render } from '@nestjs/common';

@Controller('streaming')
export class StreamingController {
  @Get()
  @Render('index')
  renderCameraStream() {
    return { message: 'Hello world!' };
  }
}
