import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Product } from './entities/Product';
import { User } from './entities/User';
import { Rating } from './entities/Rating';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL not set — TypeORM configured to use POSTGRES; set DATABASE_URL environment variable.');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [Product, User, Rating],
  migrations: [],
});

export default AppDataSource;
