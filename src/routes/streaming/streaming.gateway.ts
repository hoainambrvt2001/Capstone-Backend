import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class StreamingGateWay {
  @SubscribeMessage('newMessage')
  handleEvent(@MessageBody() body: any): any {
    console.log(body);
  }
}
