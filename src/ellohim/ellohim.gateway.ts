import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { EllohimService } from './ellohim.service';
import { CreateEllohimDto } from './dto/create-ellohim.dto';
import { UpdateEllohimDto } from './dto/update-ellohim.dto';
import { Logger } from '@nestjs/common';
import { Server } from 'net';

@WebSocketGateway({path: 'ws/ellohim'})
export class EllohimGateway {
	constructor(private readonly ellohimService: EllohimService) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: WebSocket) {
		Logger.log('Client connected');
		client.send(`connected to alpha channel`);
	}

	handleDisconnect(client: WebSocket) {
		Logger.log('Client disconnected');
		client.send(`disconnected from alpha channel`);
	}

	@SubscribeMessage('createEllohim')
	create(@MessageBody() createEllohimDto: CreateEllohimDto) {
		return this.ellohimService.create(createEllohimDto);
	}

	@SubscribeMessage('findAllEllohim')
	findAll() {
		return this.ellohimService.findAll();
	}

	@SubscribeMessage('findOneEllohim')
	findOne(@MessageBody() id: number) {
		return this.ellohimService.findOne(id);
	}

	@SubscribeMessage('updateEllohim')
	update(@MessageBody() updateEllohimDto: UpdateEllohimDto) {
		return this.ellohimService.update(updateEllohimDto.id, updateEllohimDto);
	}

	@SubscribeMessage('removeEllohim')
	remove(@MessageBody() id: number) {
		return this.ellohimService.remove(id);
	}

	@SubscribeMessage('ping')
    ping() 
	{
        return this.ellohimService.ping();
    }
}
