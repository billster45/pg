export type SampleDatakey = "orders" | "schools" | "sakila";

export type SampleDataMeta<T extends SampleDatakey> = {
  key: T;
  name: string;
  description: string;
};

export const SAMPLE_DATA: SampleDataMeta<SampleDatakey>[] = [
  {
    key: "sakila",
    name: "Sakila Database",
    description:
      "Postgres port of the Sakila film rental sample DB (large import).",
  },
  {
    key: "orders",
    name: "Order Database",
    description:
      "Order System Database, with users, orders, product, and order_items table",
  },
  {
    key: "schools",
    name: "Schools Database",
    description: "School management database with teachers and students data",
  },
];

export const getSampleDatabaseQuery = async (
  key: SampleDatakey
): Promise<string> => {
  switch (key) {
    case "orders":
      return await import("./orders-database.sql?raw").then(
        (res) => res.default
      );
    case "schools":
      return await import("./schools-database.sql?raw").then(
        (res) => res.default
      );
    case "sakila": {
      const [schema, data] = await Promise.all([
        import("./sakila-schema.sql?raw").then((res) => res.default),
        import("./sakila-insert-data.sql?raw").then((res) => res.default),
      ]);

      // PGLite doesn't support role/ownership DDL from pg_dump.
      const cleanedSchema = schema
        .split("\n")
        .filter((line) => {
          const trimmed = line.trimStart();
          if (/^ALTER\b/i.test(trimmed) && / OWNER TO /i.test(trimmed))
            return false;
          if (/^CREATE OR REPLACE PROCEDURAL LANGUAGE\b/i.test(trimmed))
            return false;
          return true;
        })
        .join("\n");

      return `${cleanedSchema}\n\n${data}`;
    }
  }

  throw new Error("failed to load data");
};
