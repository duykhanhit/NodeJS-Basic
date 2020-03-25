module.exports = function (io) {
    var usernames = [];

    io.sockets.on("connection", function (socket) {
        console.log("Have a new user connected");

        // Sự kiện thêm username
        socket.on("addUser", function (username) {
            socket.username = username;
            usernames.push(username);

            // Thông báo đến người đang dùng
            var data = {
                sender: "BOT",
                message: "You have join chat room"
            };

            socket.emit("update_message", data);

            // Thông báo tới người dùng khác

            var data = {
                sender: "BOT",
                message: username + " have join to chat room"
            };

            socket.broadcast.emit("update_message", data);
        });

        // Lắng nghe sự kiện send_message
        socket.on("send_message", function (message) {
            // Thông báo tới bản thân
            var data = {
                sender: "You",
                message: message
            };
            socket.emit("update_message", data);

            // Thông báo tới người dùng khác
            var data = {
                sender: socket.username,
                message: message
            };
            socket.broadcast.emit("update_message", data);
        });

        // Lắng nghe sự kiện disconnect
        socket.on("disconnect", function () {
            // Xóa user
            for (var i = 0; i < usernames.length; i++) {
                if (usernames[i] == socket.username) {
                    usernames.splice(i, 1);
                }
            }

            // Thông báo tới các user khác

            var data = {
                sender: "BOT",
                message: socket.username + " thoát khỏi phòng chat"
            };

            socket.broadcast.emit("update_message", data);
        });

    });
}