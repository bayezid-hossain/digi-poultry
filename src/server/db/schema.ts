import { relations } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  boolean,
  index,
  text,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { DATABASE_PREFIX as prefix } from "@/lib/constants";
export const userType = pgEnum("type", ["company", "farmer", "investor"]);

export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    firstName: varchar("firstName", { length: 255 }).notNull(),
    lastName: varchar("lastName", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    avatar: varchar("avatar", { length: 255 }),
    userType: userType("userType").notNull().default("farmer"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => ({
    emailIdx: index("user_email_idx").on(t.email),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  companyRecord: many(companyRecord),
  farmerRecord: many(farmerRecord),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
  }),
);

export const emailVerificationCodes = pgTable(
  "email_verification_codes",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 21 }).unique().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 8 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("verification_code_user_idx").on(t.userId),
    emailIdx: index("verification_code_email_idx").on(t.email),
  }),
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("password_token_user_idx").on(t.userId),
  }),
);

export const companyRecord = pgTable(
  "company_record",
  {
    id: varchar("id").primaryKey(),
    text: text("text"),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => ({
    userIdx: index("post_user_idx").on(t.userId),
    createdAtIdx: index("post_created_at_idx").on(t.createdAt),
  }),
);

export const companyRelation = relations(companyRecord, ({ one }) => ({
  user: one(users, {
    fields: [companyRecord.userId],
    references: [users.id],
  }),
}));

export type Company = typeof companyRecord.$inferSelect;
export type NewcompanyRecord = typeof companyRecord.$inferInsert;

export const farmerRecord = pgTable("farmerRecord", {
  id: varchar("id").primaryKey(),
  text: text("text"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
});

export const farmerRecordRelation = relations(farmerRecord, ({ one }) => ({
  user: one(users, {
    fields: [farmerRecord.userId],
    references: [users.id],
  }),
}));

export type Farmer = typeof farmerRecord.$inferSelect;
export type NewFarmerRecord = typeof farmerRecord.$inferInsert;
