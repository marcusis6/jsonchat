import { Socket } from "socket.io";
import { getChatRepository } from "../config/config";
import logger from "../config/logger";
import { ClientError } from "../models/ClientError";
import { Message } from "../models/Message";
const log = logger(__filename);

// Define the handler function for the "chatMessage" event
async function handleChatMessage(
  message: Message,
  callback: (arg0: string) => void,
  socket: Socket
): Promise<void> {
  log.info(`Received chat message: ${JSON.stringify(message)}`);

  try {
    if (!message?.text?.trim()) throw ClientError.invalidError();

    // get the repository
    const repository = getChatRepository();

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    const id =
      messages.length > 0
        ? Math.max(...messages.map((msg) => parseInt(msg.id))) + 1
        : 0;
    message.id = id.toString();
    message.username = socket?.request?.session?.userInfo?.username;
    message.sender = socket?.id;

    // save
    const result = await repository.add(message);
    log.info(`Successfully added new chat message ${JSON.stringify(result)}`);

    // Call the callback function to acknowledge the event
    if (typeof callback === "function") {
      callback(JSON.stringify(result));
    }

    // Broadcast the chat message to all connected clients except the sender
    socket.broadcast.emit("chatMessage", message);
  } catch (err) {
    log.error(err);
  }
}

// Define the handler function for the "requestMissingMessages" event
async function handleMissingMessage(
  id: number,
  callback: (response: string) => void
): Promise<void> {
  log.info(`Received missing messages request for id: ${id}`);

  try {
    if (!id) throw ClientError.invalidError();

    // get the repository
    const repository = getChatRepository();

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    // Find the missing messages in the repository from the sequence ID to the latest sequence
    const missingMessages = messages.filter((msg) => {
      return parseInt(msg.id) >= id;
    });

    log.info(`Missing messages found: ${JSON.stringify(missingMessages)}`);

    // Call the callback function to acknowledge the event
    if (typeof callback === "function") {
      callback(JSON.stringify(missingMessages));
    }
  } catch (err) {
    log.error(err);
  }
}

async function handleInitialMessages(
  socket: Socket,
  callback: (response: string) => void
): Promise<void> {
  try {
    // get the repository
    const repository = getChatRepository();

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    if (messages.length > 0) {
      /*  The Math.max() function returns the larger of the two provided values. 
      So, if the calculated starting index is negative, Math.max() will compare it
       with 0 and return 0 as the maximum value.
      */
      const startIndex = Math.max(messages.length - 25, 0); // Calculate the starting index for the last 25 messages

      // Return the last 25 messages
      const filteredMessages = messages.slice(startIndex);

      // Call the callback function to acknowledge the event
      if (typeof callback === "function") {
        log.info(`Sending initial messages to SocketId: ${socket.id}`);
        callback(JSON.stringify(filteredMessages));
      }
    }
  } catch (err) {
    log.error(err);
  }
}

async function handleLoadMoreMessages(
  data: any,
  socket: Socket,
  callback: (response: string) => void
): Promise<void> {
  try {
    if (!data.offset || !data.limit) throw ClientError.invalidError();

    // convert strings to numbers
    data.offset = parseInt(data.offset);
    data.limit = parseInt(data.limit);

    // get the repository
    const repository = getChatRepository();

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    if (messages.length > 0) {
      // the indices do not go below 0 and the resulting moreMessages array
      // will contain the minimum number of messages
      const startIndex = Math.max(
        messages.length - data.offset - data.limit,
        0
      );
      const endIndex = Math.max(messages.length - data.offset, 0);
      const moreMessages = messages.slice(startIndex, endIndex);

      // Call the callback function to acknowledge the event
      if (typeof callback === "function") {
        log.info(`Sending load more messages to SocketId: ${socket.id}`);
        callback(JSON.stringify(moreMessages));
      }
    }
  } catch (err) {
    log.error(err);
  }
}

// Define the handler function for the "editMessage" event
async function handleEditMessage(
  updatedMessage: Message,
  socket: Socket,
  callback: (arg0: string) => void
): Promise<void> {
  log.info(`Received edit message: ${JSON.stringify(updatedMessage)}`);

  try {
    if (!updatedMessage?.id?.trim() || !updatedMessage?.text?.trim())
      throw ClientError.invalidError();

    // Get the repository
    const repository = getChatRepository();

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    // Get the message by id
    const message: Message = messages.filter((msg) => {
      return msg.id == updatedMessage.id;
    })[0];

    message.text = updatedMessage.text;

    // Update the message or perform any necessary actions
    updatedMessage = await repository.update(message);

    // Call the callback function to acknowledge the event
    if (typeof callback === "function") {
      callback("ok");
    }

    // Broadcast the edited message to all connected clients except the sender
    socket.broadcast.emit("editedMessage", updatedMessage);
  } catch (err) {
    log.error(err);
  }
}

async function handleDeleteMessage(
  id: string,
  socket: Socket,
  callback: (response: string) => void
): Promise<void> {
  try {
    if (!id) throw ClientError.invalidError();

    // get the repository
    const repository = getChatRepository();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await repository.remove(id);

    if (result) {
      // Call the callback function to acknowledge the event
      if (typeof callback === "function") {
        log.info(`Deleted message with id: ${id}`);

        // Broadcast the deleted message to all connected clients except the sender
        socket.broadcast.emit("deletedMessage", id);

        callback(JSON.stringify({ success: true }));
      }
    }
  } catch (err) {
    log.error(err);
  }
}

export {
  handleChatMessage,
  handleMissingMessage,
  handleInitialMessages,
  handleLoadMoreMessages,
  handleEditMessage,
  handleDeleteMessage,
};
