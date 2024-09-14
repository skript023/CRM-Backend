import { PartialType } from '@nestjs/mapped-types';
import { CreateEllohimDto } from './create-ellohim.dto';

export class UpdateEllohimDto extends PartialType(CreateEllohimDto) {
  id: number;
}
