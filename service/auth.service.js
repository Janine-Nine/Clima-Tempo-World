login(data: any) {
  return this.http.post('http://localhost:3000/api/auth/login', data);
}

refreshToken() {
  const refresh = localStorage.getItem('refresh');
  return this.http.post('http://localhost:3000/api/auth/refresh', { token: refresh });
}

saveTokens(access: string, refresh: string) {
  localStorage.setItem('token', access);
  localStorage.setItem('refresh', refresh);
}

getToken() {
  return localStorage.getItem('token');
}