import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, type: AuthResponseDto })
    @Throttle({ default: { ttl: 60, limit: 3 } })
    @Post('register')
    register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
      return this.auth.register(dto);
    }


    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @Throttle({ default: { ttl: 60, limit: 5 } })
    @Post('login')
    login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
      return this.auth.login(dto);
    }
}
