import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

export class UserRepository {
  constructor(private repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  saveRefreshToken(userId: number, token: string) {
    return this.repo.update(userId, { refreshToken: token });
  }
}
