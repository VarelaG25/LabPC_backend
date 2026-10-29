import mongoose from 'mongoose';
import type { IDataContext } from './IDataContext';
import { MongoContext } from './MongoContext';
import { MongoDbContext } from './MongoDbContext';

export type DataSource = 'mongo' | 'memory';

export async function connectDatabase(uri: string): Promise<void> {
  await mongoose.connect(uri);
  console.log(`Conectado a MongoDB: ${mongoose.connection.name}`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

/**
 * Crea la fuente de datos de una colección.
 * En memoria arranca con los datos de ejemplo; en MongoDB, si la colección
 * está vacía, la llena con esos mismos datos.
 */
export async function createDataContext<T extends { id: number }>(
  source: DataSource,
  collectionName: string,
  seed: T[],
): Promise<IDataContext<T>> {
  if (source === 'memory') {
    return new MongoContext<T>(seed);
  }

  const context = new MongoDbContext<T>(collectionName);
  if ((await context.count()) === 0) {
    for (const document of seed) {
      await context.insertOne(document);
    }
  }
  return context;
}
