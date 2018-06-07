// Your code goes here
import net from 'net';

const commands = {
    create: () => console.log('create!!'),
    insert: () => console.log('insert!!'),
    delete: () => console.log('delete!!'),
    get: () => console.log('get!!')
};

const getData = data =>
    data
        .toString()
        .replace(/(\r\n\t|\n|\r\t)/gm, '')
        .split(':');

const server = net.createServer(socket => {
    socket.write('TCP server running ... \r\n');
    socket.pipe(socket);
    socket.on('data', data => {
        const [cmd, id, position, text] = getData(data);
        if (!Object.keys(commands).includes(cmd))
            return socket.write('=> Unrecognized command \n');
        commands[cmd]();
    });
});

server.on('error', err => {
    throw err;
});

server.listen(1337, '127.0.0.1');
