
var io = null;

function initializeSocketIo(app) {
    var io = require('socket.io')(app);

    // Socket IO events
    io.on('connection', function (socket) {
        console.log('new connection');

        socket.on('watchContent', function(data) {
            if (socket.rooms.indexOf(data.contentId) === -1) {
                console.log('thinger watching thingy '+data.contentId);
                socket.join(data.contentId);
            }
        });

        socket.on('unwatchContent', function (data) {
            socket.leave(data.contentId);
            console.log(data.username + ' left question: ' + data.contentId)
        });

        socket.on('error', function(data) {
            console.error('Socket error!');
            console.error(data)
        })
    });

    return io;

}


module.exports = function init(app) {
    if ((!module.exports.io) && app) {
        module.exports.io = initializeSocketIo(app);
    }
    return module.exports;
}
