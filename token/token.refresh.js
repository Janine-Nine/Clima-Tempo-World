async refresh(token: string) {
  const decoded = this.jwtService.verify(token);

  const user = await this.userRepo.findById(decoded.id);

  if (user.refreshToken !== token) {
    throw new Error('Token inválido');
  }

  const newAccess = this.jwtService.sign(
    { id: user.id },
    { expiresIn: '15m' }
  );

  return { accessToken: newAccess };
}