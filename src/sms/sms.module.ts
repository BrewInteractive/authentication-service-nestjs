import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UndefinedServiceError } from '../error';
import { SmsServiceType } from './enum/sms-service-type.enum';
import { MutluCellSmsService } from './providers/mutlucell/mutlucell-sms.service';

@Module({
    imports: [],
    providers: [
        {
            provide: "MutluCellSmsConfig",
            useFactory: (configService: ConfigService) => configService.get("mutlucell"),
            inject: [ConfigService],
        },
        MutluCellSmsService,
        {
            provide: "SmsService",
            useFactory: (
                mutluCellSmsService: MutluCellSmsService,
                configService: ConfigService,
            ) => {
                const smsServiceType = configService.get("smsService");

                switch (smsServiceType) {
                    case SmsServiceType.MUTLUCELL:
                        return mutluCellSmsService;
                    default:
                        throw new UndefinedServiceError(smsServiceType, "Sms Service");
                }
            },
            inject: [MutluCellSmsService, ConfigService],
        },
    ],
    exports: ["SmsService"],
})
export class SmsModule { }
