import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { ActivationResponse, LoginResponse, LogoutResponse, RegisterResponse } from "./types/user.type";
import { Response, Request } from "express";
import { ActivationDto, LoginDto, RegisterDto } from "./dto/user.dto";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { AuthGuard } from "./guards/auth.guard";

@Resolver(`User`)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Mutation(() => RegisterResponse)
    async register(
        @Args(`registerInput`) registerDto: RegisterDto,
        @Context() context: { res: Response }
    ): Promise<RegisterResponse> {
        if (!registerDto.name || !registerDto.email || !registerDto.password) {
            throw new BadRequestException('Please fill all the fields')
        }
        const { activation_token } = await this.usersService.register(registerDto, context.res);
        return { activation_token };
    }

    @Mutation(() => ActivationResponse)
    async activationUser(
        @Args(`activationInput`) activationDto: ActivationDto,
        @Context() context: { res: Response }
    ): Promise<ActivationResponse> {
        return await this.usersService.activateUser(activationDto, context.res);
    }

    @Mutation(() => LoginResponse)
    async login(
        @Args(`loginInput`) loginDto: LoginDto
    ): Promise<LoginResponse> {
        return await this.usersService.login(loginDto);
    }

    @Query(() => [User])
    async getAllUsers() {
        return this.usersService.getUsers();
    }

    @Query(() => LoginResponse)
    @UseGuards(AuthGuard)
    async getLoggedInUser(
        @Context() context: { req: Request }
    ): Promise<LoginResponse> {
        return await this.usersService.getLoggedInUser(context.req);
    }

    @Query(() => LogoutResponse)
    @UseGuards(AuthGuard)
    async logoutUser(
        @Context() context: { req: Request }
    ): Promise<LogoutResponse> {
        return await this.usersService.logoutUser(context.req);
    }
}