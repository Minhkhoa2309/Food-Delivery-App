import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

export class TokenSender {
    constructor(
        private readonly config: ConfigService,
        private readonly jwtService: JwtService
    ) { }

    public sendToken(user: User) {
        const accessToken = this.jwtService.sign(
            {
                id: user.id
            },
            {
                secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: '1d',
            }
        );

        const refreshToken = this.jwtService.sign(
            {
                id: user.id
            },
            {
                secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: '3d'
            }
        );

        return { user, accessToken, refreshToken };
    }
}