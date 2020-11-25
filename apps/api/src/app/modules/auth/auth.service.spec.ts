import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

class UserServiceStub {
  findOneByEmail(email) {
    return Promise.resolve({
      password: 'test',
      isValidPassword: (pass) => (pass === 'test'),
    })
  }
}

class JwtServiceStub {
  sign(payload, options = {}) { return ''; }
  verify(token, options = {}) { return {} }
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useClass: UserServiceStub },
        { provide: JwtService, useClass: JwtServiceStub },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
