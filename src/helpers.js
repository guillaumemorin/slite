import path from 'path';
import fs from 'fs';
import _insert from 'underscore.string/insert';

const getNotePath = docId => path.join(__dirname, `../doc/${docId}`);

export const getArgs = data =>
    data
        .toString('utf8')
        .replace(/(\r\n\t|\n|\r\t)/gm, '')
        .split(':');

export const create = (socket, docId) =>
    fs.writeFile(getNotePath(docId), '', err => {
        if (err) return socket.write('404\r\n');
        socket.write('200\r\n');
    });

export const insert = (socket, docId, position, text) => {
    if (text) {
        return fs.readFile(getNotePath(docId), (err, data) => {
            if (err) return socket.write('404\r\n');
            fs.writeFile(
                getNotePath(docId),
                _insert(data, position, text),
                err => {
                    if (err) socket.write('404\r\n');
                    socket.write('200\r\n');
                }
            );
        });
    }
    fs.appendFile(getNotePath(docId), position || '', err => {
        if (err) return socket.write('404\r\n');
        socket.write('200\r\n');
    });
};

export const remove = (socket, docId) =>
    fs.unlink(getNotePath(docId), err => {
        if (err) return socket.write('404\r\n');
        socket.write('200\r\n');
    });

export const get = (socket, docId) =>
    fs.readFile(getNotePath(docId), (err, data) => {
        if (err) return socket.write('404\r\n');
        socket.write(`${data}\r\n`);
    });
