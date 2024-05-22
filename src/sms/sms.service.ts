import { Injectable } from '@nestjs/common';
import { Sms } from './dto';

@Injectable()
export abstract class SmsService {
    abstract sendSmsAsync(sms: Sms): Promise<void>;
}
