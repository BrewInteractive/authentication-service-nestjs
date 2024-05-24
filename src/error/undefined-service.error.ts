import { ErrorExtensions, ExtendedError } from "../dto";

import { appConfig } from "../config";

export class UndefinedServiceError extends ExtendedError<ErrorExtensions> {
  constructor(service: string, serviceType: string) {
    super();
    this.message = `${serviceType} service is not defined for ${service}.`;
    this.extensions = {
      code: appConfig().errorCodePrefix + "007",
    };
  }
}
