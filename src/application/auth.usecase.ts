import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export class AuthUseCase {
  constructor(
    private userRepo,
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) throw new Error('Usuário não encontrado');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Senha inválida');

    const accessToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '15m' }
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '7d' }
    );

    await this.userRepo.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
