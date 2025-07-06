import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookInput } from './dto/create-book.input';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.book.findMany();
  }

  async create(data: CreateBookInput) {
    return this.prisma.book.create({
      data,
    });
  }
}