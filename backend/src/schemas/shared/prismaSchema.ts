import { PrismaClient, Prisma } from '../../generated/prisma/client';

export type DbClient = PrismaClient;
export type DbTransaction = Prisma.TransactionClient;

export type ClientOrTransaction =
  | DbClient
  | DbTransaction;