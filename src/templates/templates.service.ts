import { Injectable, BadRequestException } from '@nestjs/common';
import { Template } from './template.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTemplateDto } from './dto/create-template';
import { v5 as uuidv5 } from 'uuid';
import { Buffer } from 'buffer';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { throws } from 'assert';

const fs = require('fs');
@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel('Template') private templateModel: Model<Template>,
  ) {}
  async getTemplates() {
    return this.templateModel.find();
  }
  async updateTemplate(id: any, templateDto: CreateTemplateDto, req: any) {
    let userid = req.user.user._id;

    let name = templateDto.name.replace(/[^a-zA-Z]/g, '');
    let filecontent: any = await this.templateModel.findOne({ _id: id });
    let deletePath;
    if (filecontent && filecontent._id) {
      deletePath = filecontent.filepath;
      (filecontent.filepath = name),
        (filecontent.name = templateDto.name),
        (filecontent.modifiedBy = userid),
        (filecontent.content = ''),
        (filecontent.activeStatus = templateDto.activeStatus);
      let user = await filecontent.save();
      if (!user) {
        return new BadRequestException("File didn't create");
      } else {
        let filedata: any = await this.updateFileContent(
          deletePath,
          user.filepath,
          templateDto.template,
        );

        return user.toObject({ versionKey: false });
      }
    } else {
      return new BadRequestException('Invalid template');
    }
  }
  async getTemplateData(id: any) {
    let template: any = await this.templateModel.findOne({ _id: id });
    let content: any = await this.readtheFile(
      './src/mail/templates/' + template.filepath + '.hbs',
    );
    template.content = content;
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
    let name = templateDto.name.replace(/[^a-zA-Z]/g, '');
    const newUser = new this.templateModel({
      filepath: name,
      content: '',
      name: templateDto.name,
      createdBy: userid,
      modifiedBy: userid,
      activeStatus: templateDto.activeStatus,
    });
    return await newUser.save().then(
      (user) => {
        fs.writeFile(
          './src/mail/templates/' + name + '.hbs',
          templateDto.template,
          function (err) {
            if (err) return new BadRequestException("File didn't create");
          },
        );
        return user.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
}
