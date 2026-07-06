import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class BoardArtifactDto {
  @IsUUID('4')
  id: string;
  @IsString()
  @IsIn(['stroke'])
  type: 'stroke';
}

export class BoardStrokeDto extends BoardArtifactDto {
  @IsString()
  color: string;
  @IsNumber()
  width: number;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => BoardPoint)
  points: BoardPoint[];
}

export class BoardPoint {
  @IsNumber()
  @Min(0.0)
  @Max(1.0)
  x: number;
  @IsNumber()
  @Min(0.0)
  @Max(1.0)
  y: number;
}
