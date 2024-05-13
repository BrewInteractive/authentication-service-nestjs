import { Mock } from "mockingbird";

import { SendOtpResult } from "../../../src/otp/dto/send-otp-result.dto";

export class SendOtpResultFixture extends SendOtpResult{
    @Mock()
    expiresAt: Date;
    
    @Mock()
    isSent: boolean;

    @Mock()
    otpValue?: string | undefined;
}