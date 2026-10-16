import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error: any) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.issues || error.errors,
      });
    }
  }
}
