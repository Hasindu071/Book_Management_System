import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { AuthInput } from './dto/auth.input'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(data: AuthInput) {
    const hashed = await bcrypt.hash(data.password, 10)
    const user = await this.prisma.user.create({
      data: { username: data.username, password: hashed },
    })
    return this.generateToken(user)
  }

  async login(data: AuthInput) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    })
    if (!user) throw new Error('Invalid credentials')

    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) throw new Error('Invalid credentials')

    return this.generateToken(user)
  }

  generateToken(user: { id: number; username: string }) {
    const payload = { sub: user.id, username: user.username }
    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: user.id,
        username: user.username,
      },
    }
  }
}