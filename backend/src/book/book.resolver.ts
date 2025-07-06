import { Resolver, Query } from '@nestjs/graphql';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => [Book])
  books() {
    return this.bookService.findAll();
  }
}