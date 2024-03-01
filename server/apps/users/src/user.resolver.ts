import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { RegisterResponse } from "./types/user.type";
import { Response } from "express";
import { RegisterDto } from "./dto/user.dto";
import { BadRequestException } from "@nestjs/common";
import { User } from "./entities/user.entity";

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
        const user = await this.usersService.register(registerDto, context.res);
        return { user };
    }

    @Query(() => [User])
    async getAllUsers() {
        return this.usersService.getUsers();
    }
}