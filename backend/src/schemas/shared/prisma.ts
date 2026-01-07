import { PrismaClient, Prisma } from '../../generated/prisma/client';

export type ClientOrTransaction =
  | PrismaClient
  | Prisma.TransactionClient;