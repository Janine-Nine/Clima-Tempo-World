import { Controller, Post, Body } from '@nestjs/common';
import { AuthUseCase } from '../../application/use-cases/auth.usecase';

@Controller('auth')
export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  @Post('login')
  async login(@Body() body) {
    return this.authUseCase.login(body.email, body.password);
  }
}
