import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { Response, response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number
}
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: EmailService
  ) { }

  //register users service
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (isEmailExist) {
      throw new BadRequestException("User already exists with email address")
    }
    const isPhoneExist = await this.prisma.user.findUnique({
      where: {
        phone_number
      }
    });
    if (isPhoneExist) {
      throw new BadRequestException("User already exists with this phone number")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number
    }

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const activation_token = activationToken.token;

    await this.mailService.sendMail({
      email: email,
      subject: "Activate your account",
      template: "./activation-mail",
      name: name,
      activationCode: activationCode
    });

    return { activation_token, response };
  }

  //create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(Math.random() * 9000 + 1000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m'
      }
    )
    return { token, activationCode }
  }

  // activation user
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: {
      user: UserData;
      activationCode: string
    } = this.jwtService.verify(
      activationToken,
      { secret: this.configService.get<string>('ACTIVATION_SECRET') } as JwtVerifyOptions
    ) as { user: UserData, activationCode: string }

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException("Invalid activation code");
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existUser) {
      throw new BadRequestException("User already exists with email address")
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number
      }
    })

    return { user, response }
  }

  //login service
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (user && await this.comparePassword(password, user.password)) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: "Invalid credentials"
        }
      }
    }
  }

  async comparePassword(password: string, hashedPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // get logged in user
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;

    return { user, accessToken, refreshToken }
  }

  // logged out user
  async logoutUser(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;

    return { message: "Logged out successfully!" };
  }

  //get all users
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
