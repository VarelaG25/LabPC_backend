import type { Request, Response } from 'express';
import type { GetUserUseCase, LoginUseCase } from '../../Application';

export class AuthenticationController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async login(request: Request, response: Response): Promise<void> {
    const result = await this.loginUseCase.execute(request.body);
    if (!result.isSuccess) {
      response.status(401).json({ error: result.error });
      return;
    }

    response.status(200).json(result.value);
  }

  async getUser(request: Request, response: Response): Promise<void> {
    const userId = Number(request.params.userId);
    const result = await this.getUserUseCase.execute(userId);
    if (!result.isSuccess) {
      response.status(result.error === 'Usuario no encontrado.' ? 404 : 400).json({
        error: result.error,
      });
      return;
    }

    response.status(200).json(result.value);
  }
}