import { Server } from "socket.io";
import logger from "../config/logger";
const log = logger(__filename);

// Function to broadcast the active users list of connected users
export default function broadcastUsersList(io: Server): void {
  try {
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

    log.info("Broadcasting users list");
    log.info(`active users: ${usernames}`);

    // filter unique usernames
    const uniqueUsernames = [...new Set(usernames)];

    // Broadcast users list
    io.emit("activeUsersList", uniqueUsernames);
  } catch (err) {
    log.error(err);
  }
}
