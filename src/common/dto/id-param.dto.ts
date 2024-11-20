import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, Min } from 'class-validator';

export class IdParamDto {
  @IsNotEmpty()
  @Min(0)
  @Transform((params: TransformFnParams) => parseInt(params.value, 10))
  id: number;
}
