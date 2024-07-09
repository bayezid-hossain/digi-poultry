import { feed } from "@/app/(main)/_types";
import { DATABASE_PREFIX as prefix } from "@/lib/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
export const userType = pgEnum("type", ["company", "farmer", "investor"]);
export const inviteAction = pgEnum("action", ["REJECTED", "ACCEPTED", "PENDING"]);
export const notificationType = pgEnum("notification_type", [
  "normal",
  "cycle",
  "farmerBilling",
  "companyBilling",
  "invitation",
]);
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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(userOrganizations),
  // organizations: many(farmerRecord),
  sessions: many(sessions),
  fcrs: many(FCRTable),
  notifications: many(notifications),
  invites: many(invites),
}));

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    isUserVerified: boolean("isUserVerified").default(false).notNull(),
    organization: uuid("organization_id"),
  },
  (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
  }),
);
export const sessionRelations = relations(sessions, ({ one }) => ({
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

export const FCRTable = pgTable(
  "fcrRecord",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    farmerName: varchar("farmer_name", { length: 30 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
    location: varchar("location", { length: 50 }).notNull().default("Bhaluka"),
    totalDoc: doublePrecision("total_doc").default(0).notNull(),
    strain: varchar("strain", { length: 50 }).default("Ross A").notNull(),
    fcr: doublePrecision("fcr").notNull().default(0),
    stdFcr: doublePrecision("std_fcr").notNull().default(0),
    stdWeight: integer("std_weight").notNull().default(500),
    avgWeight: doublePrecision("avg_weight").notNull().default(0),
    age: doublePrecision("age").default(22).notNull(),
    todayMortality: doublePrecision("today_mortality").default(22).notNull(),
    totalMortality: doublePrecision("total_mortality").default(22).notNull(),
    disease: varchar("disease", { length: 50 }).default("none").notNull(),
    medicine: varchar("medicine", { length: 50 }).default("none").notNull(),
    cycleId: uuid("cycle_id"),
    //farmerID
    totalFeed: jsonb<string>("total_feed").default(
      JSON.stringify([
        { name: "510", quantity: 0 },
        { name: "511", quantity: 0 },
      ]),
    ),
    farmStock: jsonb("farm_stock").default([
      JSON.stringify([
        { name: "510", quantity: 0 },
        { name: "511", quantity: 0 },
      ]),
    ]),
    userId: varchar("user_id", { length: 21 }).notNull(),
  },
  (t) => ({
    fcrUserIdx: index("fcr_user_idx").on(t.userId),
  }),
);

export const fcrRelations = relations(FCRTable, ({ one }) => ({
  userId: one(users, {
    fields: [FCRTable.userId],
    references: [users.id],
  }),
}));

export const FCRStandards = pgTable(
  "fcrStandards",
  {
    age: integer("age").notNull(),
    stdWeight: integer("stdWeight").notNull(),
    stdFcr: doublePrecision("stdFcr").notNull(),
    organization: uuid("organization_id").notNull(),
  },
  (t) => ({
    fcrStdOrgIdx: index("fcr_std_org_idx").on(t.organization),
    pk: primaryKey({ columns: [t.age, t.organization] }),
  }),
);

export const fcrStdRelations = relations(FCRStandards, ({ one }) => ({
  organization: one(organizations, {
    fields: [FCRStandards.organization],
    references: [organizations.id],
  }),
}));

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
  createdBy: varchar("created_by").notNull(),
});

export const organizationRelations = relations(users, ({ many }) => ({
  FCRStandards: many(FCRStandards),
  // organizations: many(farmerRecord),
  users: many(userOrganizations),
  sessions: many(sessions),
  farmers: many(farmer),
}));

export const userOrganizations = pgTable(
  "userOrganizations",
  {
    userId: varchar("user_id").notNull(),
    organizationId: uuid("organization_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.organizationId] }),
  }),
);

export const userCycle = pgTable(
  "userCycles",
  {
    userId: varchar("user_id").notNull(),
    cycleId: uuid("cycle_id").notNull(),
    orgId: uuid("organization_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.cycleId, t.orgId] }),
  }),
);

export const farmer = pgTable("farmer", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  name: varchar("name", { length: 30 }).notNull(),
  location: varchar("location", { length: 30 }).notNull(),
  organizationId: uuid("organization_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("createdBy", { length: 21 }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
});

export const farmerRelations = relations(farmer, ({ many, one }) => ({
  FCRs: many(FCRTable),
  organizations: one(organizations),
  cycles: many(cycles),
}));

export const cycles = pgTable(
  "cycles",
  {
    id: uuid("cycleId").defaultRandom().primaryKey().unique(),
    totalDoc: doublePrecision("total_doc").default(0).notNull(),
    age: doublePrecision("age").default(0).notNull(),
    strain: varchar("strain", { length: 50 }).default("Ross A"),
    farmerId: uuid("farmer_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
    ended: boolean("end").default(false),
    endDate: timestamp("end_date"),
    organizationId: uuid("organization_id").notNull(),
    createdBy: varchar("created_by").notNull(),
    lastFcrId: varchar("last_fcr_id", { length: 21 }).default(""),
  },
  (t) => ({
    cycleFarmerIdx: index("cycle_farmer_index").on(t.farmerId),
    cycleOrganizationIdx: index("cycle_org_index").on(t.organizationId),
    cycleFCRIdx: index("cycle_fcr_index").on(t.lastFcrId),
  }),
);
export const cycleRelations = relations(cycles, ({ many, one }) => ({
  FCRStandards: many(FCRStandards),
  organizations: one(organizations),
  farmers: one(farmer),
  fcr: one(FCRTable),
}));

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    recipient: varchar("recipient_id").notNull(),
    eventType: notificationType("notification_type").default("normal").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isRead: boolean("is_read").notNull().default(false),
    cycleId: uuid("cycle_id"),
    invitationId: uuid("invitation_id"),
  },
  (t) => ({
    notificationRecipientIdx: index("notification_recipient_index").on(t.recipient),
  }),
);
export const notificationsRelations = relations(notifications, ({ many, one }) => ({
  recipients: one(users),
}));

export const invites = pgTable(
  "invites",
  {
    id: uuid("id").defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    action: inviteAction("notification_type").default("PENDING").notNull(),
    from: varchar("from").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    cycleId: varchar("cycle_id"),
    organizationId: uuid("organization_id").notNull(),
  },
  (t) => ({
    inviteRecipientIdx: index("invite_recipient_index").on(t.email),
    pk: primaryKey({ columns: [t.organizationId, t.cycleId, t.email] }),
  }),
);
export const invitesRelations = relations(invites, ({ many, one }) => ({
  recipient: one(users),
}));

export const unRegisteredEmails = pgTable("unregistered_emails", {
  email: varchar("email", { length: 255 }).unique().notNull().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp when the record is created
});
