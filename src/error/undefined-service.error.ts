export class UndefinedServiceError extends Error {
  constructor(service: string, serviceType: string) {
    super();
    this.message = `${serviceType} service is not defined for ${service}.`;
  }
}
