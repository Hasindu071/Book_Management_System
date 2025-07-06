import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { AuthInput } from './dto/auth.input'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('data') data: AuthInput) {
    const result = await this.authService.login(data)
    return result.access_token
  }

  @Mutation(() => String)
  async register(@Args('data') data: AuthInput) {
    const result = await this.authService.register(data)
    return result.access_token
  }
}