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

  async delete(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }

  async update(id: number, data: Partial<CreateBookInput>) {
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }
}