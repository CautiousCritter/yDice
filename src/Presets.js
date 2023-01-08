import { useContext } from "react";
import * as Y from "yjs";
import { useYArray, useYMap } from "zustand-yjs";
import { DocContext } from "./Editor";
import { useState } from "react";
import { settingsStore, presetStore } from "./store";
import Search from "./Utils/Search";
import Filter from "./Utils/Filter";
import Select from "react-select";

function Preset({ preset }) {
  const { yDoc } = useContext(DocContext);
  const { set, data, delete: deletePresetItem } = useYMap(preset);
  const presetStats = preset.get("stats")?.toArray() || [];
  const { data: stats } = useYArray(yDoc.getArray("stats"));
  const locked = presetStore((state) => state.locked);

  const selectActiveAdapter = stats
    .filter((stat) => presetStats.includes(stat.get("id")))
    .map((stat) => ({ label: stat.get("name"), value: stat.get("id") }));

  const selectOptionAdapter = stats.map((stat) => ({
    label: stat.get("name"),
    value: stat.get("id")
  }));

  const onChange = (event) => {
    const ids = event.map((e) => e.value);
    deletePresetItem("stats"); // is this
    set("stats", Y.Array.from(ids));
  };

  const toggle = () => {
    stats.forEach((stat) => {
      const id = stat.get("id");
      stat.set(
        "checked",
        presetStats.some((ps) => ps === id)
      );
    });
  };

  return (
    <>
      <button onClick={() => toggle()}>Activate</button>
      <input
        type="text"
        disabled={locked}
        value={data.name || ""}
        onChange={(event) => set("name", event.target.value)}
        style={{ flexGrow: 1 }}
      />

      <Select
        value={selectActiveAdapter}
        options={selectOptionAdapter}
        isMulti={true}
        onChange={onChange}
        style={{ flexGrow: 1 }}
        isDisabled={locked}
        styles={{
          container: (baseStyles, state) => ({
            ...baseStyles,
            flexGrow: "1"
          })
        }}
      />
    </>
  );
}

export default function Presets() {
  const [query, setQuery] = useState("");
  const { yDoc } = useContext(DocContext);
  const canDelete = settingsStore((state) => state.canDelete);
  const [locked, setLocked] = presetStore((state) => [
    state.locked,
    state.setLocked
  ]);

  const { data: presets, push: addPreset, delete: deletePreset } = useYArray(
    yDoc.getArray("presets")
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <header>
        <Search
          query={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
        />
      </header>
      <main
        style={{
          flex: 1,
          overflow: "auto",
          paddingInline: "1rem"
        }}
      >
        <ul style={{ columns: "20rem auto" }}>
          {presets.map((preset, index) => (
            <Filter
              query={query}
              key={preset.get("id")}
              value={preset.get("name")}
            >
              <li style={{ display: "flex", flexWrap: "wrap" }}>
                <Preset preset={preset} />
                {canDelete ? (
                  <button onClick={() => deletePreset(index)}>delete</button>
                ) : null}
              </li>
            </Filter>
          ))}
        </ul>
      </main>
      <footer style={{ paddingBottom: ".5rem", paddingTop: ".2rem" }}>
        <button
          onClick={() => {
            const newPreset = new Y.Map();
            newPreset.set("id", `${yDoc.clientID}-preset-${+new Date()}`);

            const stats = new Y.Array();
            stats.push([-1]);
            newPreset.set("stats", stats);

            addPreset([newPreset]);
          }}
        >
          Add new preset
        </button>
        <label>
          <input
            type="checkbox"
            checked={locked}
            onChange={(event) => setLocked(event.target.checked)}
            title="Lock"
          />
          Lock
        </label>
      </footer>
    </div>
  );
}
