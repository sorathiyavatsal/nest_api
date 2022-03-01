import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '../../core/config/config.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from 'src/templates/template.model';
import { TemplatesService } from 'src/templates/templates.service';

@Injectable()
export class SendEmailMiddleware {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private templateService: TemplatesService
  ) { }
  async sensSMS(
    osName: string = 'Apple',
    phone: string,
    code: string,
    manager: any = '',
    whatsapp = true,
  ) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    const client = require('twilio')(accountSid, authToken);
    let validPhone = await this.addCountrycode(phone);
    let autoCode: string = 'bSgLgZOrw/w';
    if (osName != 'Apple') autoCode = 'dmnIsLrTu2D';
    //   if(whatsapp==true && (manager=='MERCHANT' || manager=='DELIVERY' || manager=='MANAGER'))
    //   {
    client.messages
      .create({
        body: 'Your verification code for byecom ' + code,
        from: this.configService.get('TWILIO_WHATSAPP'),
        to: 'whatsapp:' + validPhone,
      })
      .then((message) =>
        console.log('whatsapp' + validPhone, message.sid, whatsapp),
      );
    // }
    // else{
    client.messages
      .create({
        body: 'Your verification code for byecom ' + code + ' \n ' + autoCode,
        from: this.configService.get('TWILIO_PHONE'),
        to: validPhone,
      })
      .then((message) => console.log('sms ' + validPhone, message.sid));
    //}
  }
  async sensSMSdelivery(
    osName: string = 'Apple',
    phone: string,
    message: string,
  ) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    const client = require('twilio')(accountSid, authToken);
    let validPhone = await this.addCountrycode(phone);
    let autoCode: string = 'bSgLgZOrw/w';
    if (osName != 'Apple') autoCode = 'dmnIsLrTu2D';
    client.messages
      .create({
        body: message,
        from: this.configService.get('TWILIO_WHATSAPP'),
        to: 'whatsapp:' + validPhone,
      })
      .then((message) =>
        console.log('whatsapp' + validPhone, message.sid, validPhone),
      );

    client.messages
      .create({
        body: message + ' \n ' + autoCode,
        from: this.configService.get('TWILIO_PHONE'),
        to: validPhone,
      })
      .then((message) => console.log('sms ' + validPhone, message.sid));
  }

  sendEmail(email: string, token: string, attachmentsArray) {
    // in the case that we will communicate with front-end app
    let link = `http://${this.configService.get(
      'WEB_APP_URI',
    )}/#/account/tokenVerifyEmail?email=${email}`;

    // in this case that will return verifyEmail to true

    let subjectObject = {
      subjectTitle: 'Welcome to Byecom',
      subjectBody: `Hello verify your email '${email}' click here '${link}'.<br>
       Verification code is <b>:  ${token}</b><br>`,
    };
    try {
      let mailOptions = {
        to: email,
        subject: subjectObject.subjectTitle,
        html: subjectObject.subjectBody,
        attachments: attachmentsArray,
      };
      this.mailerService.sendMail(mailOptions).then((info) => {
        console.log('--------email sent------');
      });
    } catch (error) {
      console.log('--------error-----');
      console.log(error);
    }
  }
  sendEmailForgot(email: string, token: string, attachmentsArray) {
    // in the case that we will communicate with front-end app
    let link = `http://${this.configService.get(
      'WEB_APP_URI',
    )}/#/account/reset/password/?email=${email}`;

    // in this case that will return verifyEmail to true

    let subjectObject = {
      subjectTitle: 'Reset Password',
      subjectBody: `You sent request to reset the password '${email}' click here '${link}'.<br>
       Verification code is <b>:  ${token}</b><br>`,
    };
    try {
      let mailOptions = {
        to: email,
        subject: subjectObject.subjectTitle,
        html: subjectObject.subjectBody,
        attachments: attachmentsArray,
      };
      this.mailerService.sendMail(mailOptions).then((info) => {
        console.log('--------email sent------');
      });
    } catch (error) {
      console.log('--------error-----');
      console.log(error);
    }
  }

  async addCountrycode(phone) {
    let strFirstThree = phone.substring(0, 3);
    if (strFirstThree == '+91' && phone.length == 13) return phone;
    else if (phone.length == 10 && strFirstThree != '+91') return '+91' + phone;
    else return '+91' + phone.substring(-10);
  }
  sendEmailAll(mailOptions: any = {}) {
    try {
      this.mailerService.sendMail(mailOptions).then((info) => {
        console.log('--------email sent------');
      });
    } catch (error) {
      console.log('--------error-----');
      console.log(error);
    }
  }

  generateMessage(content, userData) {
    // replace data with tag like,
    // #otp#, #username#, #email#, #phone#, #verifylink#, #apikey#
    return content.replace(/#([^#]+)#/g, (match, key) => {
      // If there's a replacement for the key, return that replacement.
      return userData[key] !== undefined ? userData[key] : `#${key}#`;
    });
  }

  async configAndSendSms(mailOptions: any, mailTemplate: any) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    const client = require('twilio')(accountSid, authToken);
    let validPhone = await this.addCountrycode(mailOptions.phone);
    // add hash tag for IOS
    let autoCode: string = 'bSgLgZOrw/w';
    // hash tag for android
    if (mailTemplate.device != 'IOS') autoCode = 'dmnIsLrTu2D';

    const message = this.generateMessage(mailTemplate.content, mailOptions);

    client.messages
      .create({
        body: message,
        from: this.configService.get('TWILIO_WHATSAPP'),
        to: 'whatsapp:' + validPhone,
      })
      .then((message) =>
        console.log('whatsapp' + validPhone, message.sid, validPhone),
      );

    client.messages
      .create({
        body: message + ' \n ' + autoCode,
        from: this.configService.get('TWILIO_PHONE'),
        to: validPhone,
      })
      .then((message) => console.log('sms ' + validPhone, message.sid));
  }

  async configAndSendEmail(mailOptions: any, mailTemplate: any) {
    try {
      let mailData = {
        to: mailOptions.email,
        subject: mailTemplate.emailSubject,
        html: this.generateMessage(mailTemplate.content, mailOptions),
        attachments: mailOptions?.attachmentsArray || [],
      };
      await this.mailerService.sendMail(mailData).then((info) => {
        console.log('--------email sent------');
      });
    } catch (error) {
      console.log('--------error-----');
      console.log(error);
    }
  }

  async sendEmailOrSms(mailOptions: any = {}) {
    try {
      const query = {
        name: mailOptions.name,
        type: mailOptions.type,
        activeStatus: true,
      }
      const mailTemplate = await this.templateService.getTemplateByQuery(query);
      if (!mailTemplate) {
        console.log('--------template not found------');
        return;
      }
      if (mailOptions.type == 'SMS') {
        await this.configAndSendSms(mailOptions, mailTemplate);
      } else {
        mailOptions.verifylink = `http://${this.configService.get('WEB_APP_URI')}/#/account/tokenVerifyEmail?email=${mailOptions.email}`;
        await this.configAndSendEmail(mailOptions, mailTemplate);
      }
    } catch (error) {
      console.log('--------error-----');
      console.log(error);
    }
  }
}
