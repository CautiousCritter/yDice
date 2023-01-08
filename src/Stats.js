import { useContext } from "react";
import * as Y from "yjs";
import { useYArray, useYMap } from "zustand-yjs";
import { DocContext } from "./Editor";
import { useState } from "react";
import { settingsStore } from "./store";
import Filter from "./Utils/Filter";
import Search from "./Utils/Search";
import { statStore } from "./store";

function Stat({ stat, locked }) {
  const { set, data } = useYMap(stat);

  return (
    <>
      <input
        type="checkbox"
        checked={data.checked || false}
        onChange={(event) => set("checked", event.target.checked)}
      />
      <input
        type="text"
        value={data.name || ""}
        onChange={(event) => set("name", event.target.value)}
        placeholder="Name"
        style={{ flexGrow: 1, minWidth: "2rem" }}
        disabled={locked}
      />
      <input
        type="number"
        value={data.value || 0}
        onChange={(event) => set("value", event.target.value)}
        placeholder="Value"
        style={{ textAlign: "center", width: "3rem" }}
        disabled={locked}
      />
    </>
  );
}

export default function Stats() {
  const [query, setQuery] = useState("");
  const [locked, setLocked] = statStore((state) => [
    state.locked,
    state.setLocked
  ]);
  const canDelete = settingsStore((state) => state.canDelete);

  const { yDoc } = useContext(DocContext);
  const { data: stats, push: addStat, delete: deleteStat } = useYArray(
    yDoc.getArray("stats")
  );

  const anyStatSelected = stats.some((stat) => stat.get("checked"));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      <header style={{ paddingBottom: "0.2rem" }}>
        <Search
          query={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
        />
      </header>
      <main style={{ flex: 1, overflow: "auto", paddingInline: "1rem" }}>
        <ul style={{ columns: "9rem auto" }}>
          {stats.map((stat, index) => (
            <Filter query={query} value={stat.get("name")} key={stat.get("id")}>
              <li style={{ display: "flex" }}>
                <Stat stat={stat} locked={locked} />
                {canDelete ? (
                  <button onClick={() => deleteStat(index)}>delete</button>
                ) : null}
              </li>
            </Filter>
          ))}
        </ul>
      </main>
      <footer style={{ paddingBottom: ".5rem", paddingTop: ".2rem" }}>
        <button
          onClick={(event) => {
            const newStat = new Y.Map();
            newStat.set("id", `${yDoc.clientID}-stat-${+new Date()}`);
            addStat([newStat]);
          }}
        >
          Add new stat
        </button>
        <button
          onClick={(event) => {
            stats.forEach((stat) => {
              stat.set("checked", false);
            });
          }}
          disabled={!anyStatSelected}
        >
          Deselect all
        </button>
        <label>
          <input
            type="checkbox"
            checked={locked}
            onChange={(event) => setLocked(event.target.checked)}
          />
          Lock
        </label>
      </footer>
    </div>
  );
}
