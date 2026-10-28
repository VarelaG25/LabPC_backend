import mongoose from 'mongoose';
import type { IDataContext, Query, Update } from './IDataContext';

type NativeDocument = mongoose.mongo.Document;
type NativeCollection = mongoose.mongo.Collection<NativeDocument>;

/**
 * Acceso a una colección de MongoDB.
 * Trabaja con el `id` numérico de los modelos; el `_id` que genera MongoDB
 * se queda dentro de esta clase.
 */
export class MongoDbContext<T extends { id: number }> implements IDataContext<T> {
  private static readonly projection = { _id: 0 };

  constructor(private readonly collectionName: string) {}

  async find(query: Query<T> = {}): Promise<T[]> {
    const documents = await this.collection
      .find(query as NativeDocument, { projection: MongoDbContext.projection })
      .sort({ id: 1 })
      .toArray();
    return documents as unknown as T[];
  }

  async findOne(query: Query<T>): Promise<T | null> {
    const document = await this.collection.findOne(query as NativeDocument, {
      projection: MongoDbContext.projection,
    });
    return (document as unknown as T) ?? null;
  }

  async insertOne(document: T): Promise<T> {
    await this.collection.insertOne(this.toDocument(document));
    return { ...document };
  }

  async updateOne(query: Query<T>, update: Update<T>): Promise<T | null> {
    const result = await this.collection.updateOne(query as NativeDocument, {
      $set: this.toDocument(update.$set),
    });
    return result.matchedCount > 0 ? this.findOne(query) : null;
  }

  async deleteOne(query: Query<T>): Promise<boolean> {
    const result = await this.collection.deleteOne(query as NativeDocument);
    return result.deletedCount > 0;
  }

  async count(): Promise<number> {
    return this.collection.countDocuments();
  }

  async nextId(): Promise<number> {
    const [last] = await this.collection
      .find({}, { projection: { _id: 0, id: 1 } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    return ((last?.id as number | undefined) ?? 0) + 1;
  }

  private get collection(): NativeCollection {
    const database = mongoose.connection.db;
    if (!database) {
      throw new Error('No existe conexión activa con MongoDB.');
    }
    return database.collection(this.collectionName);
  }

  private toDocument(value: Partial<T>): NativeDocument {
    const { _id, ...document } = JSON.parse(JSON.stringify(value)) as NativeDocument;
    return document;
  }
}
