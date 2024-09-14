import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schema/permission.schema';
import response from 'src/interfaces/response.dto';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Permission', schema: PermissionSchema }])],
  exports: [PermissionService],  // make PermissionService available to other modules
  controllers: [PermissionController],
  providers: [PermissionService, response<Permission>],
})
export class PermissionModule {}
