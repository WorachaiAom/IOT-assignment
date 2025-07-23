import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
  const allBooks = await drizzle.select().from(students);
  return c.json(allBooks);
});

studentsRouter.get("/:stdid", async (c) => {
  const stdid = c.req.param("stdid");
  const result = await drizzle.query.students.findFirst({
    where: eq(students.stdid, stdid),
    with: {
      genre: true,
    },
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});

studentsRouter.post("/",zValidator("json", z.object({
        stdid: z.string().min(8).max(8), 
        fname: z.string().min(1), 
        lname: z.string().min(1),
        bdate: z.iso.datetime({offset: true,}).transform((data) => (dayjs(data).toDate())), 
        sex: z.string().min(1)
    })
  ),
  async (c) => {
    const { stdid, fname, lname, bdate, sex } = c.req.valid("json");
    const result = await drizzle
      .insert(students)
      .values({ stdid, fname, lname, bdate, sex})
      .returning();
    return c.json({ success: true, students: result[0] }, 201);
  }
);

studentsRouter.patch("/:stdid",zValidator("json", z.object({
        fname: z.string().min(1).optional(), 
        lname: z.string().min(1).optional(),
        bdate: z.iso.datetime({offset: true,}).optional().transform((data) => (data ? dayjs(data).toDate() : undefined)), 
        sex: z.string().optional()
    })
  ),
  async (c) => {
    const stdid = c.req.param("stdid");
    const data = c.req.valid("json");
    const updated = await drizzle.update(students).set(data).where(eq(students.stdid, stdid)).returning();
    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, book: updated[0] });
  }
);

studentsRouter.delete("/:stdid", async (c) => {
  const stdid = c.req.param("stdid");
  const deleted = await drizzle.delete(students).where(eq(students.stdid, stdid)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "student not found" }, 404);
  }
  return c.json({ success: true, book: deleted[0] });
});

export default studentsRouter;
