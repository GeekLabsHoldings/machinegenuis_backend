import { Response } from 'express';
import SystemErrorInterface, { SystemErrorContentInterface } from './SystemErrorInterface';
import { ErrorMessages } from './ErrorsEnum';

abstract class SystemErrorAbstract implements SystemErrorInterface {
  private status = 0;
  private message: ErrorMessages = ErrorMessages.NULL;
  private data: object = {};

  public getError(): SystemErrorContentInterface {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
    };
  }

  public getStatus(): number {
    return this.status;
  }
  public getMessage(): ErrorMessages {
    return this.message;
  }
  public getData(): object {
    return this.data;
  }
  public setStatus(status: number): SystemErrorInterface {
    if (this.status)
      return this
    this.status = status;
    return this;
  }
  public setMessage(message: ErrorMessages): SystemErrorInterface {
    console.error({message});
    this.message = message;
    return this;
  }
  public setData(data: object): SystemErrorInterface {
    this.data = data;
    return this;
  }
  public reset(): void {
    this.status = 0;
    this.message = ErrorMessages.NULL;
    this.data = {};
  }
  public abstract sendError(response: Response, error: unknown): Response<any>;
  public abstract throw(): never;
}

export default SystemErrorAbstract;
