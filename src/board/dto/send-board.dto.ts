import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { BoardArtifactDto, BoardStrokeDto } from './board-artifact.dto';
import { Type } from 'class-transformer';

export class SendBoardDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => BoardArtifactDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [{ value: BoardStrokeDto, name: 'stroke' }],
    },
  })
  artifacts: BoardArtifactDto[];
}
