import { Request, Response } from "express";
import logger from "../config/logger";
import { ClientError } from "../models/ClientError";
import { downloadAll } from "../services/chatService";
import { getTranslation } from "../services/TranslateService";
const log = logger(__filename);

const downloadChat = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Downloading all messages...");

  try {
    await downloadAll(res);
    log.debug("all messages downloaded successfully.");
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Handles errors and sends appropriate HTTP responses.
 *
 * @param error - The error object to handle.
 * @param res - The HTTP response object to send the response.
 */
const handleError = (error: any, res: any): void => {
  if (error instanceof ClientError) {
    // Handle client errors with a 400 Bad Request status code
    res.status(400).send({ errorMessage: getTranslation(error.message) });
  } else {
    // Log other errors and send a generic 500 Internal Server Error status code
    log.error(error);
    res.sendStatus(500);
  }
};

export { downloadChat };
