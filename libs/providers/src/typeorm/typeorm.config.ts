import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ENTITIES } from '@lib/entities';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = configService.get('DATABASE_URL');
  if (!url) {
    throw new Error('Databse url is empty');
  }
  return {
    type: 'postgres',
    url,
    schema: 'public',
    logging: configService.get('NODE_ENV') === 'development',
    entities: ENTITIES,
    migrations: [join(process.cwd(), 'migrations', '**', '*_migration.ts')],
    migrationsRun: true,
  };
};
export const appDataSourse = new DataSource(options());
