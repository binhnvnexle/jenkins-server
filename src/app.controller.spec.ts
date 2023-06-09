import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it(`should return This is ${process.env.ENV_NAME} - ${process.env.VERSION}`, () => {
      expect(appController.getHello()).toBe(`This is ${process.env.ENV_NAME} - ${process.env.VERSION}`);
    });
  });
});