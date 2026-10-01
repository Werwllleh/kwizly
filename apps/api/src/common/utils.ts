import fs from "fs";
import {LOGGER_DIR} from "./constants";
import {join} from "node:path";

export const createDir = async (path: string): Promise<void> => {
  try {
    await fs.promises.access(path);
  } catch (e) {
    await fs.promises.mkdir(path, { recursive: true });
  }
}

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatDateTime = (date: Date): string => {
  const datePart = formatDate(date);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${datePart} ${hours}:${minutes}:${seconds}`;
};

type WriteLogInfoType = {
  url: string,
  method: string,
  statusCode: number,
  duration: number
}

export const writeLog = async (date: Date, info: WriteLogInfoType): Promise<void> => {
  const filename = `${formatDate(date)}.log`;
  const filepath = join(LOGGER_DIR, filename);

  await fs.promises.appendFile(
    filepath,
    `${formatDateTime(date)} | ${info.method} | ${info.url} | ${info.statusCode} | ${info.duration}ms\n`
  );
}
