import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientesService {
  private clientes = [
    { id: 1, nome: 'Ana' },
    { id: 2, nome: 'Carlos' },
    { id: 3, nome: 'Marina' },
  ];

  findAll() {
    return this.clientes;
  }

  findOne(id: number) {
    return this.clientes.find((cliente) => cliente.id === id);
  }
}