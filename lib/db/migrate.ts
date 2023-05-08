import { migrate as migrateNode } from 'drizzle-orm/node-postgres/migrator';
import { migrate as migrateVercel } from 'drizzle-orm/vercel-postgres/migrator';
import { db } from './drizzle';

const MIGRATION_FOLDER = './migrations-folder';

async function dbMigrate() {
    if (process.env.NODE_ENV === 'production') {
        await migrateVercel(db, { migrationsFolder: MIGRATION_FOLDER });
    } else {
        await migrateNode(db, { migrationsFolder: MIGRATION_FOLDER });
    }
}

dbMigrate();
