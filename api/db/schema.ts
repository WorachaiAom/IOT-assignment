import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const genres = t.pgTable("genres", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t
    .varchar({
      length: 255,
    })
    .notNull(),
});

export const books = t.pgTable("books", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t
    .varchar({
      length: 255,
    })
    .notNull(),
  author: t
    .varchar({
      length: 255,
    })
    .notNull(),
  publishedAt: t.timestamp().notNull(),

  genreId: t.bigint({ mode: "number" }).references(() => genres.id, {
    onDelete: "set null",
  }),
});

export const bookRelations = relations(books, ({ one }) => ({
  genre: one(genres, {
    fields: [books.genreId],
    references: [genres.id],
  }),
}));

export const students = t.pgTable("students", {
  stdid:  t.varchar({length: 8}).notNull().primaryKey(), 
  fname: t.varchar({length:255}).notNull(), 
  lname: t.varchar({length:255}).notNull(),
  bdate: t.timestamp().notNull(), 
  sex: t.varchar({length:255}).notNull()
});
