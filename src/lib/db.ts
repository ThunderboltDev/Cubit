// import Dexie, { type EntityTable } from "dexie";
// import type { Solve } from "@/types/puzzles";

// class CubitDatabase extends Dexie {
//   solves!: EntityTable<Solve, "id">;

//   constructor() {
//     super("cubit-db");

//     this.version(1).stores({
//       solves: "id, puzzleId, createdAt, [puzzleId+createdAt]",
//     });
//   }
// }

// const isBrowser = typeof window !== "undefined";

// export const db = isBrowser ? new CubitDatabase() : ({} as CubitDatabase);

import type { Solve } from "@/types/puzzles";

// Define the type but don't import Dexie at top level yet
let db: import("dexie").Dexie & {
  solves: import("dexie").EntityTable<Solve, "id">;
};

// Only initialize in browser
if (typeof window !== "undefined") {
  const { Dexie } = await import("dexie");

  class CubitDatabase extends Dexie {
    solves!: import("dexie").EntityTable<Solve, "id">;

    constructor() {
      super("cubit-db");
      this.version(1).stores({
        solves: "id, puzzleId, createdAt, [puzzleId+createdAt]",
      });
    }
  }

  db = new CubitDatabase();
} else {
  // Provide a mock for SSR that throws helpful errors if accidentally used
  db = new Proxy({} as typeof db, {
    get() {
      throw new Error("Database accessed during SSR - this should not happen");
    },
  });
}

export { db };
