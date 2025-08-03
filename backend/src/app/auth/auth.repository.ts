import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@libs/models';
import { CreateUserDto } from '@libs/dtos/create-user.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(user: CreateUserDto) {
    const findUser = await this.findUserByEmail(user.email);
    if (findUser) {
      throw new HttpException('User already exists', 400);
    }
    return this.userModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      phoneNumber: user.phoneNumber,
    });
  }

  async verifyUser(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email }, attributes: { exclude: ['password'] } });
  }

  async findUserById(id: number) {
    return this.userModel.findOne({ where: { id }, attributes: { exclude: ['password'] } });
  }
}
