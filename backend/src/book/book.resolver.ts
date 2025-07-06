import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';
import { CreateBookInput } from './dto/create-book.input';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => [Book])
  books() {
    return this.bookService.findAll();
  }

  @Mutation(() => Book)
  createBook(@Args('data') data: CreateBookInput) {
    return this.bookService.create(data);
  }
}