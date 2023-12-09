import {
    forwardRef,
    MiddlewareConsumer,
    Module,
    NestModule,
    NotAcceptableException,
    RequestMethod,
} from '@nestjs/common';
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
                destination: __dirname + '/assets/avatar',
                filename: (req, file, cb) => {
                    const name = file.originalname.split('.')[0];
                    const extension = file.originalname.split('.')[1];
                    const filename = `${name}_${Date.now()}.${extension}`;

                    cb(null, filename);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    return callback(null, false);
                }

                callback(null, true);
            },
        }),
        RoleModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, AuthService],
    exports: [UsersService],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(
            { path: 'auth/profile', method: RequestMethod.GET },
            { path: 'auth/logout', method: RequestMethod.GET },

            { path: 'user', method: RequestMethod.GET },
            { path: 'user/detail/:id', method: RequestMethod.GET },
            { path: 'user/update/:id', method: RequestMethod.PATCH },
            { path: 'user/avatar/:name', method: RequestMethod.GET },
            { path: 'user/profile', method: RequestMethod.GET },
            { path: 'user/delete/:id', method: RequestMethod.DELETE },

            { path: 'role', method: RequestMethod.GET },
            { path: 'role/add', method: RequestMethod.POST },
            { path: 'role/detail/:id', method: RequestMethod.GET },
            { path: 'role/update/:id', method: RequestMethod.PATCH },
            { path: 'role/delete/:id', method: RequestMethod.DELETE },

            { path: 'activity', method: RequestMethod.GET },
            { path: 'activity/add', method: RequestMethod.POST },
            { path: 'activity/detail/:id', method: RequestMethod.GET },
            { path: 'activity/update/:id', method: RequestMethod.PATCH },
            { path: 'activity/delete/:id', method: RequestMethod.DELETE },

            { path: 'asset', method: RequestMethod.GET },
            { path: 'asset/add', method: RequestMethod.POST },
            { path: 'asset/detail/:id', method: RequestMethod.GET },
            { path: 'asset/update/:id', method: RequestMethod.PATCH },
            { path: 'asset/delete/:id', method: RequestMethod.DELETE },

            { path: 'products', method: RequestMethod.GET },
            { path: 'products/add', method: RequestMethod.POST },
            { path: 'products/detail/:id', method: RequestMethod.GET },
            { path: 'products/update/:id', method: RequestMethod.PATCH },
            { path: 'products/delete/:id', method: RequestMethod.DELETE },

            { path: 'carts', method: RequestMethod.GET },
            { path: 'carts', method: RequestMethod.POST },
            { path: 'carts/:id', method: RequestMethod.GET },
            { path: 'carts/:id', method: RequestMethod.PATCH },
            { path: 'carts/:id', method: RequestMethod.DELETE },

            { path: 'payment', method: RequestMethod.GET },
            { path: 'payment', method: RequestMethod.POST },
            { path: 'payment/:id', method: RequestMethod.GET },
            { path: 'payment/:id', method: RequestMethod.PATCH },
            { path: 'payment/:id', method: RequestMethod.DELETE },
        );
    }
}
