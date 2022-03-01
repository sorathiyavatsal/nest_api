import { Injectable, BadRequestException } from '@nestjs/common';
import { Template } from './template.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTemplateDto } from './dto/create-template';
import { v5 as uuidv5 } from 'uuid';
import { Buffer } from 'buffer';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { throws } from 'assert';
import { isBoolean } from 'class-validator';

const fs = require('fs');
@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel('Template') private templateModel: Model<Template>,
  ) {}
  async getTemplates(filter) {
    let filters: any = {};
    if(filter && Object.keys(filter).length){
      filters.activeStatus = filter.status == 'true' ? true : false;
    }
    return await this.templateModel.find(filter);
  }
  async updateTemplate(id: any, templateDto: CreateTemplateDto, req: any) {
    let userid = req.user.user._id;

    let filecontent: any = await this.templateModel.findOne({ _id: id });

    if (!filecontent) {
      Object.assign(filecontent, templateDto);
      filecontent.modifiedBy = userid;
    
      return await this.createnewTemplate(templateDto, req);
    } else {
      let user = await filecontent.save();
      return user.toObject({ versionKey: false });
    }
  }
  async getTemplateData(id: any) {
    let template: any = await this.templateModel.findOne({ _id: id });
    return template.toObject({ versionKey: false });
  }
  async updateFileContent(delete_file, filepath, content) {
    let deleteCheck: any = await this.deleteFile(delete_file);

    fs.writeFile(
      './src/mail/templates/' + filepath + '.hbs',
      content,
      function (err, data) {
        if (err) return false;
        return true;
      },
    );
  }
  async deleteFile(file) {
    fs.unlink('./src/mail/templates/' + file + '.hbs', function (err, data) {
      if (err) return false;
      else return true;
    });
  }
  async readtheFile(file) {
    return fs.readFileSync(file, 'utf8');
  }
  async createnewTemplate(templateDto: CreateTemplateDto, req: any) {
    let userid = req.user.user._id;
    const newUser = new this.templateModel(templateDto);
    newUser.createdBy = userid;
    newUser.modifiedBy = userid;
    return await newUser.save().then(
      (user) => {
        return user.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
  async deleteTemplateData(id: any) {
    let template: any = await this.templateModel.findOne({ _id: id });
    if(!template){
      return new BadRequestException("Template not found!");
    }
    template.activeStatus = false;
    template.save();
    return template.toObject({ versionKey: false });
  }
  async getTemplateByQuery(query: any){
    return await this.templateModel.findOne(query);
  }
}
