import { Server, Socket } from 'socket.io';
import { userService } from '../services/userService';
import { User } from '../utils/types';

export function setupSocketHandlers(io: Server) {
  const users: { [clientId: string]: User } = {};
  io.sockets.on('connection', async (client: Socket) => {
    console.log('A client connected');

    const broadcast = (event: string, data: any) => {
      client.emit(event, data);
      client.broadcast.emit(event, data);
    };

    // First connection
    broadcast('user', users);

    client.on("message", message => {
      //add handling name change????
      broadcast('message', message);
    })

    client.on('disconnect', () => {
      delete users[client.id];
      client.broadcast.emit('user', users);
    });
  });
}