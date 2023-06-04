import { Socket } from "socket.io";
const SESSION_RELOAD_INTERVAL = 30 * 1000;

function socketService(io: Socket): void {
  // Define the event handler for socket connection
  const onConnection = (socket: Socket) => {
    const timer = setInterval(() => {
      socket.request.session.reload((err) => {
        if (err) {
          // forces the client to reconnect
          socket.conn.close();
          // you can also use socket.disconnect(), but in that case the client
          // will not try to reconnect
        }
      });
    }, SESSION_RELOAD_INTERVAL);

    socket.on("disconnect", () => {
      clearInterval(timer);

      broadcastUsersList();
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    //console.log(socket.request.session);

    // Import the chat handler module
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { handleChatMessage } = require("../handlers/chatHandler.ts")(io);

    // Handle the "chatMessage" event
    // callback is needed for acknowledgements
    // for more info visit the link
    // https://socket.io/docs/v4/emitting-events/#acknowledgements
    socket.on("chatMessage", (message, callback) => {
      handleChatMessage(message, callback, socket);
    });

    //socket.on("join", broadcastUsersList);

    broadcastUsersList();

    // Function to broadcast the active users list of connected users
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    function broadcastUsersList() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      //const test = Array.from(io.sockets.sockets.entries());
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const usernames = Array.from(io.sockets.sockets.entries()).map(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        ([
          socketId,
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            request: { session: { userInfo: { username } = {} } = {} },
          },
        ]) => username
      );

      console.log("Broadcasting users list");
      console.log(`active users: ${usernames}`);

      const uniqueUsernames = [...new Set(usernames)];

      io.emit("activeUsersList", uniqueUsernames);
    }
  };

  // Attach the connection event handler to the Socket.IO server
  io.on("connection", onConnection);
}

export default socketService;
