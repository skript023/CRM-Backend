import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { RoleModule } from '../role/role.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MulterModule.register({
            storage: diskStorage({
                destination: __dirname + '/assets',
                filename: (req, file, cb) => {
                    const name = file.originalname.split('.')[0];
                    const extension = file.originalname.split('.')[1];
                    const filename = `${name}_${Date.now()}.${extension}`

                    cb(null, filename)
                }
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    return cb(null, false)
                }

                cb(null, true)
            }
        }),
        RoleModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, AuthService],
    exports: [UsersService]
})
export class UsersModule implements NestModule
{
    configure(consumer: MiddlewareConsumer)
    {
        consumer
        .apply(AuthMiddleware)
        .forRoutes(
            { path: 'user', method: RequestMethod.GET }, // Apply to findAll
            { path: 'user/detail/:id', method: RequestMethod.GET }, // Apply to findAll
            { path: 'user/update/:id', method: RequestMethod.PATCH }, // Apply to findAll
            { path: 'user/avatar/:name', method: RequestMethod.GET }, // Apply to findAll
            { path: 'user/profile', method: RequestMethod.GET }, // Apply to create
            { path: 'user/delete/:id', method: RequestMethod.DELETE }, // Apply to remove

            { path: 'role', method: RequestMethod.GET }, // Apply to findAll
            { path: 'role/add', method: RequestMethod.POST }, // Apply to create
            { path: 'role/detail/:id', method: RequestMethod.GET }, // Apply to findAll
            { path: 'role/update/:id', method: RequestMethod.PATCH }, // Apply to findAll
            { path: 'role/delete/:id', method: RequestMethod.DELETE }, // Apply to remove

            { path: 'activity', method: RequestMethod.GET }, // Apply to findAll
            { path: 'activity/add', method: RequestMethod.POST }, // Apply to create
            { path: 'activity/detail/:id', method: RequestMethod.GET }, // Apply to findAll
            { path: 'activity/update/:id', method: RequestMethod.PATCH }, // Apply to findAll
            { path: 'activity/delete/:id', method: RequestMethod.DELETE }, // Apply to remove

            { path: 'asset', method: RequestMethod.GET }, // Apply to findAll
            { path: 'asset/add', method: RequestMethod.POST }, // Apply to create
            { path: 'asset/detail/:id', method: RequestMethod.GET }, // Apply to findAll
            { path: 'asset/update/:id', method: RequestMethod.PATCH }, // Apply to findAll
            { path: 'asset/delete/:id', method: RequestMethod.DELETE }, // Apply to remove
            
            { path: 'products', method: RequestMethod.GET }, // Apply to findAll
            { path: 'products/add', method: RequestMethod.POST }, // Apply to create
            { path: 'products/detail/:id', method: RequestMethod.GET }, // Apply to findAll
            { path: 'products/update/:id', method: RequestMethod.PATCH }, // Apply to findAll
            { path: 'products/delete/:id', method: RequestMethod.DELETE }, // Apply to remove
            
        );
    }
}
