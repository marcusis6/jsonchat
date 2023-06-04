import { Server, Socket } from "socket.io";

const chatHandler = (io: Server) => {
  console.log("chatHandler initialized");

  // Define the handler function for the "chatMessage" event
  const handleChatMessage = (
    message: { text: string; id: string },
    callback: (response: { status: string }) => void,
    socket: Socket
  ) => {
    console.log("Received chat message:", message);
    // Process the message or perform any necessary actions

    // Add the sender information to the message object
    // Create a message object with a "text" property
    const messageObject = {
      ...message,
      username: socket?.request?.session?.userInfo?.username,
      sender: socket?.id,
    };

    // Call the callback function to acknowledge the event
    if (typeof callback === "function") {
      callback({ status: "ok" });
    }

    // Broadcast the chat message to all connected clients
    io.emit("chatMessage", messageObject);
  };

  // Return the handler function
  return {
    handleChatMessage,
  };
};

export = chatHandler;
