import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '../../core/config/config.service';

@Injectable()
export class SendEmailMiddleware {
    constructor(private mailerService: MailerService, private configService: ConfigService) { }
    async  sensSMS(phone:string,code:string,manager:any='',whatsapp=true)
    {
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        const client = require('twilio')(accountSid, authToken); 
    let validPhone=await this.addCountrycode(phone);   
//   if(whatsapp==true && (manager=='MERCHANT' || manager=='DELIVERY' || manager=='MANAGER'))
//   {
    client.messages
    .create({
       body: 'Your verification code for byecom '+code,
       from: this.configService.get('TWILIO_WHATSAPP'),
       to: 'whatsapp:'+validPhone
     })
    .then(message => console.log("whatsapp" +validPhone,message.sid,whatsapp)); 
    // }
    // else{
        client.messages
        .create({
           body: 'Your verification code for byecom '+code+" \n 23XiUiRVHsd",
           from: this.configService.get('TWILIO_PHONE'),
           to: validPhone
         })
        .then(message => console.log("sms "+validPhone,message.sid));
    //}
  }
  async  sensSMSdelivery(phone:string,message:string)
    {
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        const client = require('twilio')(accountSid, authToken); 
    let validPhone=await this.addCountrycode(phone);   

    client.messages
    .create({
       body: message,
       from: this.configService.get('TWILIO_WHATSAPP'),
       to: 'whatsapp:'+validPhone
     })
    .then(message => console.log("whatsapp" +validPhone,message.sid,validPhone)); 
   
        client.messages
        .create({
           body: message+" \n 23XiUiRVHsd",
           from: this.configService.get('TWILIO_PHONE'),
           to: validPhone
         })
        .then(message => console.log("sms "+validPhone,message.sid));
    
  }
  async addCountrycode(phone)
   {
    
    let strFirstThree = phone.substring(0,3);
    if(strFirstThree=="+91" && phone.length==13)
    return phone;
    else if(phone.length==10 && strFirstThree!="+91")
    return "+91"+phone;
    else 
    return "+91"+phone.substring(-10);
   }
    sendEmailAll(mailOptions:any={}) {
         
        try {
            
            this.mailerService.sendMail(mailOptions)
                .then((info) => {
                    console.log('--------email sent------')
                });
        } catch (error) {
            console.log('--------error-----');
            console.log(error)
        }
    }
    
    sendEmail(email: string, token: string, attachmentsArray) {

        // in the case that we will communicate with front-end app 
        let link = `http://${this.configService.get('WEB_APP_URI')}/#/account/tokenVerifyEmail?email=${email}`;

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
            this.mailerService.sendMail(mailOptions)
                .then((info) => {
                    console.log('--------email sent------')
                });
        } catch (error) {
            console.log('--------error-----');
            console.log(error)
        }
    }
    sendEmailForgot(email: string, token: string, attachmentsArray) {

        // in the case that we will communicate with front-end app 
        let link = `http://${this.configService.get('WEB_APP_URI')}/#/account/reset/password/?email=${email}`;

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
            this.mailerService.sendMail(mailOptions)
                .then((info) => {
                    console.log('--------email sent------')
                });
        } catch (error) {
            console.log('--------error-----');
            console.log(error)
        }
    }
}