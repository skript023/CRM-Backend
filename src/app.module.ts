import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ActivityModule } from './activity/activity.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
        MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ellohim.i9hc8.mongodb.net/${process.env.DB_CLUSTER}?retryWrites=true&w=majority`),
        ActivityModule,
        UsersModule,
        AuthModule,
        RoleModule
    ],
    controllers: [AppController],
    providers: [AppService],
 })
export class AppModule {}
