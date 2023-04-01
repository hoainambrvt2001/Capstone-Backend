import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailHelperService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(userEmail: string) {
    await this.mailerService.sendMail({
      to: userEmail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject:
        'Welcome to our BKAccess application! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        email: userEmail,
        name: userEmail.split('@')[0],
      },
    });
  }
}
