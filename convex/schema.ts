import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  people: defineTable({
    name: v.string(),
    applauseCount: v.number(),
    createdBy: v.optional(v.id("users")),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
