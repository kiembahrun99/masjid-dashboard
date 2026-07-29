// Data Provider abstraction layer
// Swap from mock to real API by changing this import

import { mockDb } from '@/mock-data';

export type DataProvider = typeof mockDb;

let provider: DataProvider | null = null;

export async function getDataProvider(): Promise<DataProvider> {
  if (!provider) {
    // Future: switch to Prisma/API provider based on env
    provider = mockDb;
  }
  return provider;
}

// Convenience singleton for sync access (mock only)
export function getDb(): DataProvider {
  if (!provider) provider = mockDb;
  return provider;
}