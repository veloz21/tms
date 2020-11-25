import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, UserService } from '../../core/services';
import { AuthController } from './auth.controller';

class AuthServiceStub {
  decodeRefreshToken() {
    return {
      sub: 1,
      email: 'test@email.com',
    };
  }
  getJwtTokens() {
    return {
      accessToken: ''
    }
  }
  login() {
    return Promise.resolve({
      accessToken: '',
      refreshToken: '',
    });
  }
  logout() {
    return Promise.resolve();
  }
}

class UserServiceStub {
  findOne(id) {
    return Promise.resolve({
      refreshToken: null
    })
  }
}

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
