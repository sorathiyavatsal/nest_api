import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath))
  }
  letterValue(a:any){
   
    let encode = '';
    for (let i = 0; i < a.length; i++) {
      let x = a.slice(i, i+1);
      let str= x.charCodeAt(0)
      if(str<100) 
      str=a[i].toUpperCase();
      
      encode += str;
      
    }
    return encode.replace(/[^a-zA-Z0-9]/g, "");
  }
  get(key: string): string {
    
    return this.envConfig[key];
  }
}