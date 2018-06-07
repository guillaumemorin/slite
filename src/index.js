// Your code goes here
import net from 'net';

const server = net.createServer((socket) => {
	socket.write('TCP server running ... \r\n');
	socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
