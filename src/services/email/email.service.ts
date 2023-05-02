import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(userEmail: string) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject:
        'Welcome to our BKAccess application! Confirm your Email',
      template: './confirmation', // `.hbs` extension
      context: {
        email: userEmail,
        name: userEmail.split('@')[0],
      },
    });
  }
}
