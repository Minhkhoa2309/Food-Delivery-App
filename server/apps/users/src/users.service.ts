import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ConfigService: ConfigService,
    private readonly prisma: PrismaService
  ) { }

  //register users service
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where:{
        email
      }
    });
    if (isEmailExist) {
      throw new BadRequestException("User already exists with email address")
    }
    const user = await this.prisma.user.create({
      data:{
        name,
        email,
        password
      }
    })

    return {user, response};
  }

  //login service
  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;
    const user = {
      email,
      password
    };

    return user;
  }

  //get all users
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
