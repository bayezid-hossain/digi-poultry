import { DATABASE_PREFIX as prefix } from "@/lib/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  doublePrecision,
  jsonb,
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
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

export const usersRelations = relations(users, ({ one, many }) => ({
  companyRecord: many(companyRecord),
  farmerRecord: many(farmerRecord),
  sessions: many(sessions),
  fcrs: many(FCRTable),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    isUserVerified: boolean("isUserVerified").default(false).notNull(),
  },
  (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
  }),
);
export const sessionRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
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

export const FCRTable = pgTable(
  "fcrRecord",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    farmerName: varchar("farmer_name", { length: 30 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
    location: varchar("location", { length: 50 }).notNull().default("Bhaluka"),
    totalDoc: doublePrecision("total_doc").default(0).notNull(),
    strain: varchar("strain", { length: 50 }).default("Ross A"),
    fcr: doublePrecision("fcr").notNull().default(0),
    stdFcr: doublePrecision("std_fcr").notNull().default(0),
    stdWeight: integer("std_weight").notNull().default(500),
    avgWeight: doublePrecision("avg_weight").notNull().default(0),
    age: doublePrecision("age").default(22).notNull(),
    todayMortality: doublePrecision("today_mortality").default(22).notNull(),
    totalMortality: doublePrecision("total_mortality").default(22).notNull(),
    disease: varchar("disease", { length: 50 }).default("none"),
    medicine: varchar("medicine", { length: 50 }).default("none"),

    totalFeed: jsonb("total_feed").default({ 510: 0, 511: 0 }),
    farmStock: jsonb("farm_stock").default({ 510: 0, 511: 0 }),
    userId: varchar("user_id", { length: 21 }).notNull(),
  },
  (t) => ({
    fcrUserIdx: index("fcr_user_idx").on(t.userId),
  }),
);

export const fcrRelations = relations(FCRTable, ({ one, many }) => ({
  userId: one(users, {
    fields: [FCRTable.userId],
    references: [users.id],
  }),
}));
export type FCR = typeof FCRTable.$inferSelect;
export type NewFCR = typeof FCRTable.$inferInsert;

export const FCRStandards = pgTable("fcrStandards", {
  age: integer("age").notNull().primaryKey().unique(),
  stdWeight: integer("stdWeight").notNull(),
  stdFcr: doublePrecision("stdFcr").notNull(),
});
export type FCRStandard = typeof FCRStandards.$inferSelect;
export type NewFCRStandard = typeof FCRStandards.$inferInsert;
