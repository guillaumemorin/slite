import net from 'net';
import {getArgs, insert, get, create, remove, format} from './helpers';

const commands = {
    create: (socket, docId) => create(socket, docId),
    insert: (socket, docId, position, text) =>
        insert(socket, docId, position, text),
    delete: (socket, docId) => remove(socket, docId),
    get: (socket, docId, type) => get(socket, docId, type),
    format: (socket, docId, start, end, style) =>
        format(socket, docId, start, end, style)
};

const server = net.createServer(socket => {
    socket.on('data', data => {
        const [cmd, id, ...rest] = getArgs(data);
        if (!commands[cmd]) return socket.write('=> Unrecognized command \n');
        if (!id) return socket.write('=> You must provide a note id \n');
        commands[cmd](socket, id, ...rest);
    });
});

server.on('error', err => {
    throw err;
});

server.listen(1337, '127.0.0.1');
