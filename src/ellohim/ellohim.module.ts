import { Module } from '@nestjs/common';
import { EllohimService } from './ellohim.service';
import { EllohimGateway } from './ellohim.gateway';

@Module({
  providers: [EllohimGateway, EllohimService],
})
export class EllohimModule {}
