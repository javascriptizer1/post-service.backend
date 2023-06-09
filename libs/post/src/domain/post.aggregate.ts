import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsBoolean,
  validateSync,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { IPost } from './post.interface';
import { PostServices } from './services';
import { DomainError } from '@lib/errors';

export class PostAggregate extends PostServices implements IPost {
  @IsUUID()
  id: string = randomStringGenerator();

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsBoolean()
  @Exclude()
  isPublished = false;

  @IsString()
  createdAt = new Date().toISOString();

  @IsString()
  updatedAt = new Date().toISOString();

  private constructor() {
    super();
  }

  static create(post: Partial<IPost>) {
    const _post = new PostAggregate();
    Object.assign(_post, post);
    _post.updatedAt = post?.id ? new Date().toISOString() : _post.updatedAt;

    const errors = validateSync(_post);

    if (errors.length) {
      throw new DomainError(errors, 'Post is not valid');
    }
    return _post;
  }
}
