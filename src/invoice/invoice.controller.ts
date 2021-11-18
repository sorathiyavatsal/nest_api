import { Controller, SetMetadata,UploadedFiles, Request,Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { InvoiceService } from "./invoice.service"
import { ApiTags, ApiSecurity, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateInvoiceDto } from './dto/create-invoice';
import { EditInvoiceDto } from './dto/edit-invoice';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { Express } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('delivery-fleet')
@ApiTags('Delivery Fleet')
@ApiSecurity('api_key')

export class InvoiceController {
    constructor(private deliveryService: InvoiceService) {

    }
   /* @Post('/')
    
    @UseInterceptors(FilesInterceptor('files'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          fromAddress: {type:'string'},
          fromZipcode: {type:'string'},
          fromLat: {type:'string'},
          fromLng: {type:'string'},
          fromPhone: {type:'string'},
          toAddress: {type:'string'},
          toZipcode: {type:'string'},
          toLat: {type:'string'},
          toLng: {type:'string'},
          toPhone: {type:'string'},
          goods: {type:'string'},
          numberofPack: {type:'string'},
          weightPack: {type:'string'},
          pickupType: {type:'string'},
          pickupDate: {type:'string'},
          pickupTime: {type:'string'},
          cor: {type:'string'},
          deliverChargeType: {type:'boolean'},
          invoiceStatus: {type:'string'},
          activeStatus :{type:'boolean'},
          files: {
            
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
                      },
          
        },
      },
    })
   
    async testParams(@UploadedFiles() files: Array<Express.Multer.File>,@Req() req) {
     return  {body:req.body,files: files};
      //return await this.deliveryService.createnewInvoice(file,req);
    }*/
    @Put('/update/:id')
    @UseInterceptors(
      FilesInterceptor('image', 20, {
        storage: diskStorage({
          destination: './public/uploads',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiParam({name: 'id', required: true})
    async updateInvoice(@Param() params,@UploadedFiles() files,@Req() req) {
      const response = [];
      files.forEach(file => {
        const fileReponse = {
          originalname: file.originalname,
          filename: file.filename,
        };
        response.push(fileReponse);
      });
      return await this.deliveryService.updateInvoice(params.id,response,req);
    }
    @Get('/')
    async getTemplates(@Req() req) {
     
      return await this.deliveryService.getInvoices(req);
    } 
    @Get('/:id')
    @ApiParam({name: 'id', required: true})
    async getInvoiceData(@Param() params,@Req() req) {
     
      return await this.deliveryService.getInvoiceData(params.id,req);
    }
 
 @Post('/add')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  async addInvoice(@UploadedFiles() files,@Req() res) {
    const response = [];
    files.forEach(file => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    
    return await this.deliveryService.createnewInvoice(response,res);
  }
  
}
export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}.${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};