import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateSchema } from './template.model';


@Module({
  imports:[
    MongooseModule.forFeature([
    { name: 'Template', schema: TemplateSchema }
  ]),
  
 
],
  providers: [TemplatesService],
  controllers: [TemplatesController],
  exports:[TemplatesService]
})
export class TemplatesModule {}
