export type Query<T> = Partial<T>;

export interface Update<T> {
  $set: Partial<T>;
}

/**
 * Operaciones que ofrece cualquier fuente de datos.
 * Hay dos implementaciones: una en memoria (MongoContext) y otra sobre MongoDB
 * (MongoDbContext). Los repositorios solo conocen esta interfaz, así que se
 * puede cambiar de una a otra sin tocar la lógica de negocio.
 */
export interface IDataContext<T extends { id: number }> {
  find(query?: Query<T>): Promise<T[]>;
  findOne(query: Query<T>): Promise<T | null>;
  insertOne(document: T): Promise<T>;
  updateOne(query: Query<T>, update: Update<T>): Promise<T | null>;
  deleteOne(query: Query<T>): Promise<boolean>;
  count(): Promise<number>;
  nextId(): Promise<number>;
}
