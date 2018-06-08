import path from 'path';
import fs from 'fs';
import _insert from 'underscore.string/insert';

const STYLE_TEMPLATE = {
    bold: {symbol: '**', positions: []},
    italic: {symbol: '*', positions: []}
};

const getNotePath = docId => path.join(__dirname, `../notes/${docId}`);
const getNoteStylePath = docId =>
    path.join(__dirname, `../notes/${docId}_style.json`);

export const getArgs = data =>
    data
        .toString('utf8')
        .replace(/(\r\n\t|\n|\r\t)/gm, '')
        .split(':');

export const create = (socket, docId) =>
    fs.writeFile(getNotePath(docId), '', err => {
        if (err) return socket.write('404\r\n');
        fs.writeFile(
            getNoteStylePath(docId),
            JSON.stringify(STYLE_TEMPLATE),
            err => {
                if (err) socket.write('404\r\n');
                socket.write('200\r\n');
            }
        );
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

export const get = (socket, docId, type = 'txt') => {
    fs.readFile(getNotePath(docId), (err, txt) => {
        if (err) return socket.write('404\r\n');
        if (type === 'txt') return socket.write(`${txt}\r\n`);
        fs.readFile(getNoteStylePath(docId), (err, styles) => {
            if (err) return socket.write('404\r\n');
            const formatted = Object.values(JSON.parse(styles)).reduce(
                (acc, style) =>
                    style.positions.reduce((acc2, position, index) => {
                        const symbolLength = style.symbol.length;
                        const start =
                            parseInt(position.start) +
                            parseInt(index * symbolLength);
                        const end =
                            parseInt(position.end) +
                            parseInt(symbolLength) +
                            parseInt(index * symbolLength);
                        const startSymbolAdded = _insert(
                            acc2,
                            start,
                            style.symbol
                        );
                        return _insert(startSymbolAdded, end, style.symbol);
                    }, acc),
                txt.toString()
            );
            socket.write(`${formatted}\r\n`);
        });
    });
};

export const format = (socket, docId, start, end, style) => {
    return fs.readFile(getNoteStylePath(docId), (err, data) => {
        if (err) return socket.write('404\r\n');
        const json = JSON.parse(data);
        fs.writeFile(
            getNoteStylePath(docId),
            JSON.stringify({
                ...json,
                [style]: {
                    ...json[style],
                    positions: json[style].positions.concat({start, end})
                }
            }),
            err => {
                if (err) socket.write('404\r\n');
                socket.write('200\r\n');
            }
        );
    });
};
