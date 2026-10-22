export type Query<T> = Partial<T>;

export interface Update<T> {
  $set: Partial<T>;
}

export class MongoContext<T extends { id: number }> {
  private readonly collection: T[];

  constructor(seed: T[] = []) {
    this.collection = seed.map((item) => ({ ...item }));
  }

  async find(query: Query<T> = {}): Promise<T[]> {
    return this.collection
      .filter((item) => this.matches(item, query))
      .map((item) => ({ ...item }));
  }

  async findOne(query: Query<T>): Promise<T | null> {
    const item = this.collection.find((candidate) => this.matches(candidate, query));
    return item ? { ...item } : null;
  }

  async insertOne(document: T): Promise<T> {
    this.collection.push({ ...document });
    return { ...document };
  }

  async updateOne(query: Query<T>, update: Update<T>): Promise<T | null> {
    const item = this.collection.find((candidate) => this.matches(candidate, query));
    if (!item) {
      return null;
    }

    Object.assign(item, update.$set);
    return { ...item };
  }

  async deleteOne(query: Query<T>): Promise<boolean> {
    const index = this.collection.findIndex((candidate) => this.matches(candidate, query));
    if (index < 0) {
      return false;
    }

    this.collection.splice(index, 1);
    return true;
  }

  private matches(item: T, query: Query<T>): boolean {
    return Object.entries(query).every(([key, value]) => item[key as keyof T] === value);
  }
}
