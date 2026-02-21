import Dexie, { type EntityTable } from "dexie";
import type { Solve } from "@/types/puzzles";

class CubitDatabase extends Dexie {
	solves!: EntityTable<Solve, "id">;

	constructor() {
		super("cubit-db");

		this.version(1).stores({
			solves: "id, puzzleId, createdAt, [puzzleId+createdAt]",
		});
	}
}

export const db = new CubitDatabase();
