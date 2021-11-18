import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
@Injectable()
export class ApiKeyStrategy  extends PassportStrategy(HeaderAPIKeyStrategy) {
constructor(private authService: AuthService) {
    
super({ header: 'api_key', prefix: '' }, true, (apikey, done, req) => {
const checkKey =  authService.validateApiKey(apikey);
console.log(checkKey)
if (!checkKey) {
return done(false);
}
return done(true);
});
}
}