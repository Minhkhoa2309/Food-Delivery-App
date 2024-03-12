import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../../../prisma/prisma.service";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {

    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext();

        const accessToken = req.headers.accesstoken as string;
        const refreshToken = req.headers.refreshtoken as string;

        if (accessToken == 'undefined' || refreshToken == 'undefined') {
            throw new UnauthorizedException('Please login to access this resource.');
        }

        if (accessToken) {
            const decoded = this.jwtService.verify(accessToken, {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
            });

            if (!decoded) {
                throw new UnauthorizedException('Invalid access token');
            }

            const expirationTime = decoded.exp;

            if (expirationTime * 1000 > Date.now()) {
                await this.updateAccessToken(req);
            }

        }
        return true;
    }

    private async updateAccessToken(req: any): Promise<void> {
        try {
            const refreshTokenData = req.headers.refreshtoken as string;
            const decoded = this.jwtService.verify(refreshTokenData, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
            })

            if (!decoded) {
                throw new UnauthorizedException('Invalid access token');
            }


            const expirationTime = decoded.exp * 1000;

            if (expirationTime < Date.now()) {
                throw new UnauthorizedException(
                    'Please login to access this resource!',
                );
            }

            const user = await this.prisma.user.findUnique({
                where: {
                    id: decoded.id
                }
            });

            const accessToken = await this.jwtService.sign(
                {
                    id: user.id
                },
                {
                    secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
                    expiresIn: '15m'
                }
            );

            const refreshToken = await this.jwtService.sign(
                {
                    id: user.id
                },
                {
                    secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
                    expiresIn: '15m'
                }
            );

            req.accesstoken = accessToken;
            req.refreshtoken = refreshToken;
            req.user = user;


        } catch (error) {
            console.log(error);
        }
    }
}