import logger from "../config/logger";
import { StorageRepository } from "../interfaces/StorageRepository";
import { ClientError } from "../models/ClientError";
import { User } from "../models/User";
import { DiskStorageRepositoryImpl } from "../repositories/DiskStorageRepositoryImpl";
import { PtStorageRepositoryImpl } from "../repositories/PtStorageRepositoryImpl";
const log = logger(__filename);

let repository: StorageRepository<User> | null = null;

// singeleton idea:
// https://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-a-singleton-in-javascript

export default function getRepository(): StorageRepository<User> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  if (!repository) {
    const repositoryName = process.env.REPOSITORY_NAME || "ptStorage";
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const siteId = process.env.PT_SITE_ID!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const sitePassword = process.env.PT_SITE_PASSWORD!;
    log.info("initializing repository");

    try {
      switch (repositoryName) {
        case "ptStorage":
          log.info("Pt has been chosen as the default repository");
          repository = new PtStorageRepositoryImpl(siteId, sitePassword);
          break;
        case "diskStorage":
          log.info("Disk Storage has been chosen as the default repository");
          repository = new DiskStorageRepositoryImpl<User>("User");
          break;
        // add more cases for other repository types as needed
        default:
          log.error(`Invalid repository name: ${repositoryName}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log.error(`Error creating repository: ${error.message}`);
    }
  }

  if (!repository) {
    log.error("Could not instantiate repository");
    // we throw a "connection failed" error, since we have observed that
    // such errors can be caused by connection issues.
    throw ClientError.connectionFailedError();
  }

  return repository;
}
