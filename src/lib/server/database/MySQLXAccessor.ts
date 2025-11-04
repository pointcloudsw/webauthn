import mysqlx, { type Client, type Session, type Collection, type SortExprStrList, type Table } from '@mysql/xdevapi';
import type { int64 } from '@mysql/xdevapi/types/lib/Protocol/ScalarValues';

export interface ConnectionConfig {
  host: string;
  port?: string | number;
  user: string;
  password: string;
  schema?: string;
}

export interface AppDb {
    cfg: ConnectionConfig;
    collection: string;
    db?: MySQLXAccessor;  // Fixed: Removed angle brackets
}

export type MySqlDoc = mysqlx.Document;

export interface QueryOptions {
  bind?: string | {} | undefined;
  limit?: number;
  offset?: number;
  sort?: SortExprStrList;
}

export class MySQLXAccessor {
  private client: Client | null = null;
  private session: Session | null = null;
  private config: ConnectionConfig;

  constructor(config: ConnectionConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      this.client = mysqlx.getClient({
          host: this.config.host,
          port: Number(this.config?.port) || 33060,  // Fixed: X DevAPI default port
          user: this.config.user,
          password: this.config.password,
          schema: this.config.schema
        },
        {
          pooling: {
            enabled: true,
            maxSize: 10,
            maxIdleTime: 20000,
            queueTimeout: 5000
          }
        }
      );

      this.session = await this.client.getSession();
      console.log('Connected to MySQL X DevAPI');
    } catch (error) {
      throw new Error(`Connection failed: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.session) {
      await this.session.close();
    }
    if (this.client) {
      await this.client.close();
    }
    console.log('Disconnected from MySQL X DevAPI');
  }

  getSchema(schemaName?: string): mysqlx.Schema {
    if (!this.session) {
      throw new Error('Not connected to database');
    }
    return this.session.getSchema(schemaName || this.config.schema || 'test');
  }

  async createCollection(schemaName: string, collectionName: string): Promise<Collection> {
    const schema = this.getSchema(schemaName);
    return await schema.createCollection(collectionName);
  }

  async getCollection(schemaName: string, collectionName: string): Promise<Collection> {
    const schema = this.getSchema(schemaName);
    return schema.getCollection(collectionName);
  }

  async insertOne(
    schemaName: string,
    collectionName: string,
    document: Record<string, any>
  ): Promise<any> {
    const collection = await this.getCollection(schemaName, collectionName);
    const result = await collection.add(document).execute();
    return result.getGeneratedIds()[0];
  }

  async insertMany(
    schemaName: string,
    collectionName: string,
    documents: Record<string, any>[]
  ): Promise<string[]> {
    const collection = await this.getCollection(schemaName, collectionName);
    const result = await collection.add(documents).execute();
    return result.getGeneratedIds();
  }

  async findOne(
    schemaName: string,
    collectionName: string,
    criteria?: string
  ): Promise<any> {
    const collection = await this.getCollection(schemaName, collectionName);
    const query = collection.find(criteria);
    const result = await query.limit(1).execute();
    const docs = result.fetchAll();
    return docs[0] || null;
  }

  // async find(
  //   schemaName: string,
  //   collectionName: string,
  //   criteria?: string,
  //   options?: QueryOptions
  // ): Promise<any[]> {
  async find(
    schemaName: string,
    collectionName: string,
    criteria?: string,
    options?: QueryOptions
  ): Promise<MySqlDoc[]> {
    const collection = await this.getCollection(schemaName, collectionName);
    let query = collection.find(criteria);

    if (options?.bind) {
      query = query.bind(options.bind);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    if (options?.sort) {
      query = query.sort(options.sort);
    }

    const result = await query.execute();
    return result.fetchAll();
  }

  async update(
    schemaName: string,
    collectionName: string,
    updates: Record<string, any>,
    criteria: string,
    options?: QueryOptions
  ): Promise<int64> {
    const collection = await this.getCollection(schemaName, collectionName);
    let modify = collection.modify(criteria);


    if (options?.bind) {
      modify = modify.bind(options.bind);
    }

    if (options?.limit) {
      modify = modify.limit(options.limit);
    }    

    for (const [key, value] of Object.entries(updates)) {
      modify = modify.set(key, value);
    }

    const result = await modify.execute();

    return result.getAffectedItemsCount();
  }

  async updateOne(
    schemaName: string,
    collectionName: string,
    criteria: string,
    updates: Record<string, any>
  ): Promise<int64> {
    const collection = await this.getCollection(schemaName, collectionName);
    let modify = collection.modify(criteria);

    for (const [key, value] of Object.entries(updates)) {
      modify = modify.set(key, value);
    }

    const result = await modify.limit(1).execute();
    return result.getAffectedItemsCount();
  }

  async updateMany(
    schemaName: string,
    collectionName: string,
    criteria: string,
    updates: Record<string, any>
  ): Promise<int64> {
    const collection = await this.getCollection(schemaName, collectionName);
    let modify = collection.modify(criteria);

    for (const [key, value] of Object.entries(updates)) {
      modify = modify.set(key, value);
    }

    const result = await modify.execute();
    return result.getAffectedItemsCount();
  }

  async delete(
    schemaName: string,
    collectionName: string,
    criteria: string,
    options?: QueryOptions
  ): Promise<int64> {
    const collection = await this.getCollection(schemaName, collectionName);
    let query = await collection.remove(criteria);
    
    if (options?.bind) {
      query = query.bind(options.bind);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const result = await query.execute();
    return result.getAffectedItemsCount();
  }

  async deleteMany(
    schemaName: string,
    collectionName: string,
    criteria: string
  ): Promise<int64> {
    const collection = await this.getCollection(schemaName, collectionName);
    const result = await collection.remove(criteria).execute();
    return result.getAffectedItemsCount();
  }

  async executeSQL(sql: string, ...params: any[]): Promise<any[]> {
    if (!this.session) {
      throw new Error('Not connected to database');
    }
    const result = await this.session.sql(sql).bind(params).execute();
    return result.fetchAll();
  }

  getTable(schemaName: string, tableName: string): Table {
    const schema = this.getSchema(schemaName);
    return schema.getTable(tableName);
  }

  isConnected(): boolean {
    return this.session !== null;
  }
}