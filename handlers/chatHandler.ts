import { Socket } from "socket.io";
import logger from "../config/logger";
import { StorageRepository } from "../interfaces/StorageRepository";
import { Message } from "../models/Message";
import { DiskStorageRepositoryImpl } from "../repositories/DiskStorageRepositoryImpl";
const log = logger(__filename);

// Define the handler function for the "chatMessage" event
async function handleChatMessage(
  message: Message,
  callback: (arg0: string) => void,
  socket: Socket
): Promise<void> {
  let repository: StorageRepository<Message> | null = null;

  log.info(`Received chat message: ${JSON.stringify(message)}`);

  try {
    // get the repository
    repository = new DiskStorageRepositoryImpl<Message>("Message");

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    const sequence_id =
      messages.length > 0
        ? Math.max(...messages.map((msg) => msg.sequence_id)) + 1
        : 0;
    message.sequence_id = sequence_id;
    message.username = socket?.request?.session?.userInfo?.username;
    message.sender = socket?.id;

    // save
    const result = await repository.add(message);
    log.info(`Successfully added new chat message ${JSON.stringify(result)}`);

    // Call the callback function to acknowledge the event
    if (typeof callback === "function") {
      callback(JSON.stringify(result));
    }

    // Broadcast the chat message to all connected clients
    socket.broadcast.emit("chatMessage", message);
  } catch (err) {
    log.error(err);
  }
}

// Define the handler function for the "requestMissingMessages" event
async function handleMissingMessage(
  sequenceId: number,
  callback: (response: string) => void
): Promise<void> {
  let repository: StorageRepository<Message> | null = null;

  log.info(`Received missing messages request for sequenceId: ${sequenceId}`);

  try {
    // get the repository
    repository = new DiskStorageRepositoryImpl<Message>("Message");

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    // Find the missing messages in the repository from the sequence ID to the latest sequence
    const missingMessages = messages.filter((msg) => {
      return msg.sequence_id >= sequenceId;
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

export { handleChatMessage, handleMissingMessage };
