import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './schema/asset.schema';
import * as mongoose from 'mongoose'
import { NotFoundError } from 'rxjs';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class AssetService {
    constructor(@InjectModel(Asset.name) private assetModel: mongoose.Model<Asset>)
    { }

    async create(createAssetDto: CreateAssetDto)
    {
        const asset = await this.assetModel.create(createAssetDto);

        return {
            message: `Asset ${asset["product"]} created successfully`
        }
    }

    async findAll() : Promise<Asset[]>
    {
        const asset = await this.assetModel.find(null, { createdAt: 0, updatedAt: 0, __v: 0 }).
            populate('product', ['name', 'game', 'target', 'file']).
            populate('user', ['fullname', 'username']);

        return asset;
    }

    async findOne(id: string) : Promise<Asset>
    {
        const asset = this.assetModel.findById(id, { createdAt: 0, updatedAt: 0, __v: 0 }).
            populate('product', ['name', 'game', 'target', 'file']).
            populate('user', ['fullname', 'username']);

        if ((await asset).expired) throw new UnauthorizedException()

        asset.projection({ expired: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        return asset;
    }

    async update(id: string, updateAssetDto: UpdateAssetDto)
    {
        const asset = await this.assetModel.findByIdAndUpdate(id, updateAssetDto, {
            new: true, runValidators: true
        }) as any;

        if (!asset) throw new NotFoundException('Update asset failed')

        return {
            message: `Update asset ${asset.product} successfully`
        };
    }

    async remove(id: string)
    {
        const asset = await this.assetModel.findByIdAndDelete(id) as any;

        if (!asset) throw new NotFoundException('Delete asset failed')

        return {
            message: `Update asset ${asset.product} successfully`
        };
    }

    //running on milliseconds
    @Interval(3600000)
    async handleCronAssetCleaning()
    {
        const asset = await this.findAll();

        asset.map((asset) =>
        {
            if (asset.expired)
            {
                this.remove(asset._id);
            }
        });
    }
}
