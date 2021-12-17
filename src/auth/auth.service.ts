import { device } from 'express-device';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ArgumentsHost,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserVerification } from 'src/core/models/userVerification.model';
import { UserLogin } from 'src/core/models/userLogin.model';
import { DeliveryFleet } from 'src/delivery_fleet/deliveryfleet.model';
import { ForgotPasswordCredentialsDto } from './dto/forgotpassword-credentials.dto';
import { ResetPasswordCredentialsDto } from './dto/resetpassword-credentials.dto';
import { EmailVerifyCredentialsDto } from './dto/emailVerify-credentials.dto';
import { MangerDeliveryCredentialsDto } from './dto/manager-delivery-credentials.dto';
import { AccountSetupDto } from './dto/account-setup-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import { User } from './user.model';
import { v1 as uuidv1 } from 'uuid';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { ConfigService } from '../core/config/config.service';
import { Role } from './role.enum';
import { SecurityService } from '../security/security.service';
import { TokenInstance } from 'twilio/lib/rest/api/v2010/account/token';
import { OtpVerifyCredentialsDto } from './dto/otpVerify-credentials.dto';
const DeviceDetector = require('node-device-detector');
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('DeliveryFleet') private deliveryfleetModel: Model<DeliveryFleet>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserLogin') private UserLoginModel: Model<UserLogin>,
    @InjectModel('UserVerification')
    private userVerificationModel: Model<UserVerification>,

    private jwtService: JwtService,
    private sendEmailMiddleware: SendEmailMiddleware,
    private configService: ConfigService,
    private securityService: SecurityService,
  ) {
    
  }
  async validateApiKey(key: any) {
    return await this.securityService.validateApiKey(key);
  }
  async findRole(key: any) {
    if (Object.values(Role).includes(key)) return true;
    else return false;
  }
  async createmobileUser(userCredentialsDto: MangerDeliveryCredentialsDto, req: any) {
    if (!userCredentialsDto.verifyType) {
      return new BadRequestException('Verification type is required');
    }
    let userToAttempt = await this.findOneByPhone(userCredentialsDto.phoneNumber);
    if (userToAttempt) {
      let userotp: any = await this.loginVerificationSmsOtp(userToAttempt);
      return { user: userToAttempt, message: 'Verification sent to mobile' };
    }
    let findroles = this.findRole(userCredentialsDto.role);
    if (!findroles) userCredentialsDto.role = 'USER';
    let usersCount = await this.userModel.estimatedDocumentCount();
    let today = new Date().toISOString().substr(0, 10);
    let todayDate = today.replace(/-/g, '');
    let reDigit = usersCount.length;
    if(userCredentialsDto.deliveryId)
    {
       this.deliveryfleetModel.update({_id:userCredentialsDto.deliveryId},{$set:{
         userId:userToAttempt._id,
         createdBy:userToAttempt._id,
         modifiedBy:userToAttempt._id
       }});
    }
    let userId = todayDate + usersCount;
    const newUser = new this.userModel({
      userId: userId,
      password: Math.floor(Math.random() * 1000000000).toString(),
      role: userCredentialsDto.role,
      verifyType: userCredentialsDto.verifyType,
      phoneNumber: userCredentialsDto.phoneNumber,
    });

    return await newUser.save().then(user => {
      let verifiedTemplate = 'register';
      if (user.verifyType != 'email') verifiedTemplate = 'registersms';
      const newTokenVerifyEmail = new this.userVerificationModel({
        verificationType: user.verifyType,
        verifiedTemplate: verifiedTemplate,
        createdBy: user._id,
        createdUser: user._id,
        modifiedBy: user._id,
        otp: Math.floor(100000 + Math.random() * 900000),
      });
      newTokenVerifyEmail.save();

      this.sendEmailMiddleware.sensSMS(
        user.phoneNumber,
        newTokenVerifyEmail.otp,
        user.role,
        false
      );

      return user.toObject({ versionKey: false });
    });
  }
  async loginVerificationSmsOtp(user: any) {
    let verifiedTemplate = 'loginsms';
    const newTokenVerifyEmail = new this.userVerificationModel({
      verificationType: 'sms',
      verifiedTemplate: verifiedTemplate,
      createdBy: user._id,
      createdUser: user._id,
      modifiedBy: user._id,
      otp: Math.floor(1000 + Math.random() * 9000),
    });
    newTokenVerifyEmail.save();

    this.sendEmailMiddleware.sensSMS(
      user.phoneNumber,
      newTokenVerifyEmail.otp,
      user.role,
    );

    return newTokenVerifyEmail;
  }
  async createUser(userCredentialsDto: UserCredentialsDto) {
    let userToAttempt = await this.findOneByEmail(userCredentialsDto.email);
    if (!userToAttempt) {
      let findroles = this.findRole(userCredentialsDto.role);
      if (!findroles) userCredentialsDto.role = 'USER';
      let usersCount = await this.userModel.estimatedDocumentCount();
      let today = new Date().toISOString().substr(0, 10);
      let todayDate = today.replace(/-/g, '');
      let reDigit = usersCount.length;

      let userId = todayDate + usersCount;
      const newUser = new this.userModel({
        userId: userId,
        email: userCredentialsDto.email,
        password: userCredentialsDto.password,
        role: userCredentialsDto.role,
        verifyType: userCredentialsDto.verifyType,
        phoneNumber: userCredentialsDto.phoneNumber,
      });

      return await newUser.save().then(user => {
        let verifiedTemplate = 'register';
        if (user.verifyType != 'email') verifiedTemplate = 'registersms';
        const newTokenVerifyEmail = new this.userVerificationModel({
          verificationType: user.verifyType,
          verifiedTemplate: verifiedTemplate,
          createdBy: user._id,
          createdUser: user._id,
          modifiedBy: user._id,
          otp: Math.floor(100000 + Math.random() * 900000),
        });
        newTokenVerifyEmail.save();
        if (user.verifyType == 'email') {
          let emailData: any = {
            to: user.email,
            subject: 'User Verification',
            template: './register',
            context: {
              code: newTokenVerifyEmail.otp,
            },
          };
          this.sendEmailMiddleware.sendEmailAll(emailData);
        } else {
          this.sendEmailMiddleware.sensSMS(
            user.phoneNumber,
            newTokenVerifyEmail.otp,
            user.role,
          );
        }
        return user.toObject({ versionKey: false });
      });
    } else {
      return new BadRequestException('Email already exist!');
    }
  }
  async userLoginToken(user: any, request: any) {
    let userLoginData: any = this.userDeviceData(request)
    const payload: any = {
      token: this.createJwtPayload(user),
    };
    userLoginData.userId = user._id;
    userLoginData.createdBy = user._id;
    userLoginData.modifiedBy = user._id;
    userLoginData.attemptStatus = true;
    userLoginData.attemptError = '';
    userLoginData.loginTime = new Date();
    this.saveLoginRequest(userLoginData);
    return payload
  }
  async userDeviceData(request: any) {
    let geo: any = request.ip;
    const detector = new DeviceDetector();
    const userAgent =
      'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
    const results = detector.detect(userAgent);


    const resultOs = detector.parseOs(userAgent);
    const resultClient = detector.parseClient(userAgent);
    const resultDeviceType = detector.parseDeviceType(userAgent, resultOs, resultClient, {});
    const result: any = Object.assign({ os: resultOs }, { client: resultClient }, { device: resultDeviceType });
    let userLoginData: any = {
      device: result.device,
      ipAddress: geo,
      result: result.device,
      browser: request.headers['user-agent'],
    };
    console.log(userLoginData)
    return userLoginData;
  }
  async validateUserByPassword(
    authCredentialsDto: AuthCredentialsDto,
    request: any,
  ) {
    let userToAttempt: any = await this.findOneByEmail(
      authCredentialsDto.email,
    );
    let userLoginData: any = this.userDeviceData(request)
    if (!userToAttempt) {
      userLoginData.attemptStatus = false;
      userLoginData.attemptError = 'Email not found !';
      this.saveLoginRequest(userLoginData);
      throw new BadRequestException('Email not found !');
    }
    return new Promise((resolve, reject) => {
      userToAttempt.checkPassword(
        authCredentialsDto.password,
        (err, isMatch) => {
          if (err) {
            userLoginData.attemptStatus = false;
            userLoginData.attemptError = 'Unauthorized access';
            this.saveLoginRequest(userLoginData);
            reject(new UnauthorizedException());
          }
          if (isMatch) {
            if (userToAttempt.emailVerified == false) {
              userLoginData.userId = userToAttempt._id;
              userLoginData.createdBy = userToAttempt._id;
              userLoginData.modifiedBy = userToAttempt._id;
              userLoginData.attemptStatus = false;
              userLoginData.attemptError =
                'User not verified the email or phone';
              this.saveLoginRequest(userLoginData);
              reject(new BadRequestException(`Please verify your email!`));
            }
            const payload: any = {
              token: this.createJwtPayload(userToAttempt),
            };
            userLoginData.userId = userToAttempt._id;
            userLoginData.createdBy = userToAttempt._id;
            userLoginData.modifiedBy = userToAttempt._id;
            userLoginData.attemptStatus = true;
            userLoginData.attemptError = '';
            userLoginData.loginTime = new Date();
            this.saveLoginRequest(userLoginData);
            resolve(payload);
          } else {
            userLoginData.userId = userToAttempt._id;
            userLoginData.createdBy = userToAttempt._id;
            userLoginData.modifiedBy = userToAttempt._id;
            userLoginData.attemptStatus = false;
            userLoginData.attemptError = "Password don't match";
            this.saveLoginRequest(userLoginData);
            reject(new BadRequestException(`Password don't match`));
          }
        },
      );
    });
  }
  async saveLoginRequest(data: any) {
    console.log(data)
    let userLoginModel = new this.UserLoginModel(data);
    userLoginModel.save();
    // return userLoginModel;
  }
  async forgotPassword(
    forgotPasswordCredentialsDto: ForgotPasswordCredentialsDto,
  ) {
    let userToAttempt: any = await this.findOneByEmail(
      forgotPasswordCredentialsDto.email,
    );
    if (!userToAttempt) throw new BadRequestException('Email not found !');

    return new Promise((resolve, reject) => {
      if (userToAttempt.emailVerified == false)
        reject(new BadRequestException(`Please verify your email!`));
      else {
        let verifiedTemplate = 'forgotpassword';
        if (userToAttempt.verifyType != 'email')
          verifiedTemplate = 'forgotpasswordsms';
        const newTokenVerifyEmail = new this.userVerificationModel({
          verificationType: userToAttempt.verifyType,
          verifiedTemplate: verifiedTemplate,
          createdBy: userToAttempt._id,
          createdUser: userToAttempt._id,
          modifiedBy: userToAttempt._id,
          otp: Math.floor(100000 + Math.random() * 900000),
        });
        newTokenVerifyEmail.save();
        if (userToAttempt.verifyType != 'email') {
          this.sendEmailMiddleware.sensSMS(
            userToAttempt.phoneNumber,
            newTokenVerifyEmail.otp,
            userToAttempt.role,
          );
        } else {
          let emailData: any = {
            to: userToAttempt.email,
            subject: 'Forgot Password',
            template: './forgotpassword',
            context: {
              code: newTokenVerifyEmail.otp,
            },
          };
          this.sendEmailMiddleware.sendEmailAll(emailData);
        }
        resolve({ message: 'Please check your email for next step' });
      }
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }
  async findOneByPhone(phone: string): Promise<User> {
    return await this.userModel.findOne({ phoneNumber: phone });
  }
  async findOneById(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id });
  }
  async getAllUsers() {
    return await this.userModel.find();
  }

  async validateUserByJwt(payload: JwtPayload) {
    let user = await this.findOneByPhone(payload.phoneNumber);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    const user = await this.jwtService.verify(token);
    return user;
  }
  createJwtPayload(user) {
    let data: JwtPayload = {
      _id: user._id,
      userId: user.userId,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
    console.log(this.configService.get('JWT_SECRET'));
    return sign(data, this.configService.get('JWT_SECRET'), {
      expiresIn: '15d',
    });
  }

  async verifyTokenByEmailPassword(
    resetPasswordCredentialsDto: ResetPasswordCredentialsDto,
  ) {
    try {
      if (
        resetPasswordCredentialsDto.password !=
        resetPasswordCredentialsDto.confirmPassword
      ) {
        return new BadRequestException(
          'Password does not match with confirm password',
        );
      }
      let user = await this.findOneByEmail(resetPasswordCredentialsDto.email);
      if (!user) throw new BadRequestException('Email not found !');
      let passwordTokenData = await this.userVerificationModel.findOne({
        createdUser: user._id,
        otp: resetPasswordCredentialsDto.code,
        verifiedStatus: false,
      });
      if (!passwordTokenData) {
        return new BadRequestException('Verification code is invalid!');
      }
      return await this.userModel
        .findOne({ email: resetPasswordCredentialsDto.email })
        .then(
          userToAttempt => {
            passwordTokenData.verifiedStatus = true;
            passwordTokenData.verifiedTime = new Date();
            passwordTokenData.save();
            userToAttempt.password = resetPasswordCredentialsDto.password;
            userToAttempt.save();
            return { msg: 'Password  is successfully updated!' };
          },
          error => {
            throw new BadRequestException('Email not found !');
          },
        );
    } catch (e) {
      return new BadRequestException('Internal server error');
    }
  }
  async profileUpdate(
    userId: any, accountSetupDto: AccountSetupDto, request: any
  ) {

    if (accountSetupDto.email && accountSetupDto.email != '') {
      let existUser = await this.findOneByEmail(accountSetupDto.email)
      if (existUser)
        return new BadRequestException(
          'Email already exist!'
        );
    }
    let user: any = await this.findOneById(userId)
    if (!user) throw new BadRequestException('User not found !');
    if (accountSetupDto.email && accountSetupDto.email != '') {
      user.email = accountSetupDto.email
    }
    user.fullName = accountSetupDto.fullName;
    let userToken: any = await this.userLoginToken(user, request)
    let userData = this.userModel
      .findByIdAndUpdate(user._id, user)
      .exec();

    let userLoginData: any = this.userDeviceData(request);

    userLoginData.userId = user._id;
    userLoginData.createdBy = user._id;
    userLoginData.modifiedBy = user._id;
    userLoginData.attemptStatus = true;
    userLoginData.attemptError = '';
    userLoginData.loginTime = new Date();
    this.saveLoginRequest(userLoginData);
    return { user: user, token: userToken.token, message: 'Welcome Back!' }


  }
  async verifyOtpBySms(
    emailVerifyCredentialsDto: OtpVerifyCredentialsDto,
    res: any
  ) {
    try {
      let userToAttempt, errorMsgNotFound, successMsg: any;

      userToAttempt = await this.userModel.findOne({
        phoneNumber: emailVerifyCredentialsDto.phone,
      });
      errorMsgNotFound = 'Phone number not found !'
      successMsg = 'Phone verification is successfully!';

      if (!userToAttempt) throw new BadRequestException(errorMsgNotFound);
      let userToken: any = await this.userLoginToken(userToAttempt, res)
      return this.userVerificationModel
        .findOne({
          createdUser: userToAttempt._id,
          otp: emailVerifyCredentialsDto.code,
          verifiedStatus: false,
        })
        .then(
          data => {
            if (data) {
              let userData = this.userModel
                .findByIdAndUpdate(userToAttempt._id, { emailVerified: true, phoneVerified: true })
                .exec();
              data.verifiedStatus = true;
              data.verifiedTime = new Date();
              data.save();
              if (userToAttempt.fullName && userToAttempt.fullName != '') {

                return { user: data, token: userToken, message: 'Welcome Back!' }
              }
              else {

                return { user: data, message: "Set up your byecom account!" }
              }

            } else {
              return new BadRequestException('Verification code is invalid!');
            }
          },
          error => {
            return new BadRequestException('Verification code is invalid!');
          },
        );
    } catch (e) {
      return new BadRequestException('Internal server error');
    }
  }
  async verifyTokenByEmail(
    emailVerifyCredentialsDto: any,
  ) {
    try {
      let userToAttempt, errorMsgNotFound, successMsg: any;
      if (emailVerifyCredentialsDto.email) {
        userToAttempt = await this.userModel.findOne({
          email: emailVerifyCredentialsDto.email,
        });
        errorMsgNotFound = 'Email not found !'
        successMsg = 'Email verification is successfully!';
      }
      else {
        userToAttempt = await this.userModel.findOne({
          phoneNumber: emailVerifyCredentialsDto.phone,
        });
        errorMsgNotFound = 'Phone number not found !'
        successMsg = 'Phone verification is successfully!';
      }
      if (!userToAttempt) throw new BadRequestException(errorMsgNotFound);

      return this.userVerificationModel
        .findOne({
          createdUser: userToAttempt._id,
          otp: emailVerifyCredentialsDto.code,
          verifiedStatus: false,
        })
        .then(
          data => {
            if (data) {
              let userData = this.userModel
                .findByIdAndUpdate(userToAttempt._id, { emailVerified: true })
                .exec();
              data.verifiedStatus = true;
              data.verifiedTime = new Date();
              data.save();
              return { data: data, msg: successMsg };
            } else {
              return new BadRequestException('Verification code is invalid!');
            }
          },
          error => {
            return new BadRequestException('Verification code is invalid!');
          },
        );
    } catch (e) {
      return new BadRequestException('Internal server error');
    }
  }
}
