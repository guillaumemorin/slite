// Your code goes here
import net from 'net';

const server = net.createServer(socket => {
    socket.write('TCP server running ... \r\n');
    socket.pipe(socket);
    socket.on('data', data => {
        var read = data.toString();
        console.log('data', read);
    });
});

server.on('error', err => {
    throw err;
});

server.listen(1337, '127.0.0.1');
