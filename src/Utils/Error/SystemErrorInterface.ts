import { Response } from 'express';
import { ErrorMessages } from './ErrorsEnum';

export default interface SystemErrorInterface {
  getStatus(): number;
  getMessage(): ErrorMessages;
  getData(): object;
  setStatus(status: number): SystemErrorInterface;
  setMessage(message: ErrorMessages): SystemErrorInterface;
  setData(data: object): SystemErrorInterface;
  sendError(response: Response, error: unknown): Response;
  reset(): void;
  throw(): never;
}

export interface SystemErrorContentInterface {
  status: number;
  message: ErrorMessages;
  data: object;
}
