import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listPeople = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("people")
      .order("asc")
      .collect();
  },
});

export const addPerson = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to add people");
    }

    return await ctx.db.insert("people", {
      name: args.name,
      applauseCount: 0,
    });
  },
});

export const updateApplause = mutation({
  args: { 
    personId: v.id("people"), 
    change: v.number() 
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to update applause");
    }

    const person = await ctx.db.get(args.personId);
    if (!person) {
      throw new Error("Person not found");
    }

    const newCount = Math.max(0, person.applauseCount + args.change);
    
    await ctx.db.patch(args.personId, {
      applauseCount: newCount,
    });
  },
});

export const removePerson = mutation({
  args: { personId: v.id("people") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to remove people");
    }

    const person = await ctx.db.get(args.personId);
    if (!person) {
      throw new Error("Person not found");
    }

    await ctx.db.delete(args.personId);
  },
});
