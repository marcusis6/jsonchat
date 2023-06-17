import { Server, Socket } from "socket.io";
import {
  handleChatMessage,
  handleDeleteMessage,
  handleEditMessage,
  handleInitialMessages,
  handleLoadMoreMessages,
  handleMissingMessage,
} from "../handlers/chatHandler";
import broadcastUsersList from "../handlers/userHandler";
import { Message } from "../models/Message";

const SESSION_RELOAD_INTERVAL = 30 * 1000;

function socketService(io: Server): void {
  // Define the event handler for socket connection
  const onConnection = (socket: Socket) => {
    const sessionId = socket.request.session.id;
    socket.join(sessionId);

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
      broadcastUsersList(io);
    });

    // new user or reconnect user will get active users list
    broadcastUsersList(io);

    // Handle the "InitialMessages" event
    socket.on("InitialMessages", (callback) => {
      handleInitialMessages(socket, callback);
    });

    // Handle the "editMessage" event
    socket.on("editMessage", (message, callback) => {
      handleEditMessage(message, socket, callback);
    });

    // Handle the "DeleteMessage" event
    socket.on("deleteMessage", (id, callback) => {
      handleDeleteMessage(id, socket, callback);
    });

    // Handle the "loadMoreMessages" event
    socket.on("loadMoreMessages", (offset, limit, callback) => {
      handleLoadMoreMessages(
        { offset: offset, limit: limit },
        socket,
        callback
      );
    });

    /* Handle the "chatMessage" event
     callback is needed for acknowledgements
     for more info visit the link
     https://socket.io/docs/v4/emitting-events/#acknowledgements
     */
    socket.on("chatMessage", (message, callback) => {
      handleChatMessage(new Message(message), callback, socket);
    });

    // Event listener for requesting missing messages
    socket.on("requestMissingMessages", (id, callback) => {
      handleMissingMessage(id, callback);
    });
  };

  // Attach the connection event handler to the Socket.IO server
  io.on("connection", onConnection);
}

export default socketService;
