import { Response } from 'express';
import SystemErrorAbstract from './SystemErrorAbstract';
import { SystemErrorContentInterface } from './SystemErrorInterface';

class SystemError extends SystemErrorAbstract {
  public sendError(response: Response, error: unknown): Response<any> {
    const status = this.getStatus();
    if (status >= 100 && status < 600) {
      const error: SystemErrorContentInterface = this.getError();
      this.reset();
      return response.status(status).send(error);
    }
    return response.status(400).send(error);
  }

  public throw(): never {
    throw new Error(this.getMessage().toString());
  }
}
const systemError = new SystemError();
export default systemError;
