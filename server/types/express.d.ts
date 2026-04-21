export {}

declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}
