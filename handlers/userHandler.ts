import { Server } from "socket.io";
import logger from "../config/logger";
import { getUsers } from "../services/UserCrudService";
const log = logger(__filename);

// Function to broadcast the active users list of connected users
export default async function broadcastUsersList(io: Server): Promise<void> {
  try {
    const users = await getUsers();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const activeUsers = Array.from(io.sockets.sockets.entries()).map(
      ([
        socketId,
        {
          handshake: { time },
          request: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            session: { userInfo: { username } = {} } = {},
          },
        },
      ]) => {
        // Obtain the connection time in the Dhaka timezone
        const dhakaTimeOptions = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
          timeZone: "Asia/Dhaka",
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const connectedAt = new Date(time).toLocaleTimeString(
          "en-US",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          dhakaTimeOptions
        );

        return {
          socketId,
          username,
          connectedAt,
        };
      }
    );

    // Function to add status and additional fields to each user
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const addStatusToUsers = (users, activeUsers) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return users.map((user) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const activeUser = activeUsers.find(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          (activeUser) => activeUser.username === user.username
        );
        return {
          username: user.username,
          status: activeUser ? "online" : "offline",
          time: activeUser ? activeUser.connectedAt : "",
          socketId: activeUser ? activeUser.socketId : "",
        };
      });
    };

    // Add status and additional fields to each user
    const usersWithStatus = addStatusToUsers(users, activeUsers);

    log.info("Broadcasting usersWithStatus");
    log.info(`Users list with status: ${usersWithStatus}`);

    // // filter unique usernames
    // const uniqueUsernames = [...new Set(usersWithStatus)];

    // Broadcast usersWithStatus
    io.emit("usersWithStatus", usersWithStatus);
  } catch (err) {
    log.error(err);
  }
}
