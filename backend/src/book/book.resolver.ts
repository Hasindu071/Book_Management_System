import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';

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

  @Mutation(() => Book)
  deleteBook(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.delete(id);
  }

  @Mutation(() => Book)
  updateBook(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateBookInput,
  ) {
    return this.bookService.update(id, data);
  }
}