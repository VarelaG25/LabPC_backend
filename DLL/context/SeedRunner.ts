import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from './Database';
import { MongoDbContext } from './MongoDbContext';
import {
  commentsSeed,
  computersSeed,
  laboratoriesSeed,
  reservationsSeed,
  usersSeed,
} from './Seed';

/**
 * Borra las colecciones y vuelve a cargar los datos de ejemplo en MongoDB.
 * Se ejecuta con `npm run seed` y usa la conexión definida en el archivo .env.
 */
const collections: [string, { id: number }[]][] = [
  ['users', usersSeed],
  ['laboratories', laboratoriesSeed],
  ['computers', computersSeed],
  ['reservations', reservationsSeed],
  ['comments', commentsSeed],
];

async function run(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Define MONGODB_URI en el archivo .env.');
  }

  await connectDatabase(uri);
  for (const [name, seed] of collections) {
    await mongoose.connection.db?.collection(name).deleteMany({});
    const context = new MongoDbContext<{ id: number }>(name);
    for (const document of seed) {
      await context.insertOne(document);
    }
    console.log(`  ${name}: ${seed.length} documentos`);
  }
  await disconnectDatabase();
  console.log('Datos de ejemplo cargados.');
}

run().catch(async (error: unknown) => {
  console.error('No fue posible cargar los datos de ejemplo:', error);
  await disconnectDatabase();
  process.exit(1);
});
