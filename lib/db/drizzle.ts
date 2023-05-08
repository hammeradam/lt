import {
    pgTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import { sql as sqlVercel } from '@vercel/postgres';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleVercel } from 'drizzle-orm/vercel-postgres';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { Pool } from 'pg';

export const UsersTable = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        email: text('email').notNull(),
        image: text('image').notNull(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
    },
    (users) => {
        return {
            uniqueIdx: uniqueIndex('unique_idx').on(users.email),
        };
    }
);

export const LinksTable = pgTable('links', {
    id: serial('id').primaryKey(),
    displayName: text('name').notNull(),
    value: text('value').notNull(),
    type: text('type'),
});

export type User = InferModel<typeof UsersTable>;
export type NewUser = InferModel<typeof UsersTable, 'insert'>;

export const insertUserSchema = createInsertSchema(UsersTable);
export const selectUserSchema = createSelectSchema(UsersTable);

export const insertLinkSchema = createInsertSchema(LinksTable, {
    type: z.enum(['ig', 'fb']),
});
export const selectLinkSchema = createSelectSchema(LinksTable);

// Connect to Vercel Postgres
console.log(process.env.POSTGRES_URL);
export const db =
    process.env.NODE_ENV === 'production'
        ? drizzleVercel(sqlVercel)
        : drizzleNode(new Pool({ connectionString: process.env.POSTGRES_URL }));
