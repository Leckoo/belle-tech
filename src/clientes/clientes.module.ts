import { Module } from '@nestjs/common';
import { ClientesController } from './cliente.controller';
import { ClientesService } from './cliente.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}