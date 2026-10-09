import fs from "fs";
import {LOGGER_DIR} from "./constants";
import {join} from "node:path";
import {WriteLogInfoType} from "./types";
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

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

export const writeLog = async (date: Date, info: WriteLogInfoType): Promise<void> => {
  const filename = `${formatDate(date)}.log`;
  const filepath = join(LOGGER_DIR, filename);

  await fs.promises.appendFile(
    filepath,
    `${formatDateTime(date)} | ${info.method} | ${info.url} | ${info.statusCode} | ${info.duration}ms\n`
  );
}

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
}

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
}

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const createToken = (): string => {
  return crypto.randomUUID();
}
