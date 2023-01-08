import { useState, useContext, useMemo, useCallback } from "react";
import { useYArray, useYMap } from "zustand-yjs";
import { DocContext } from "./Editor";
import { settingsStore } from "./store";
import Profile from "./Profile";
import { random } from "./Utils/random";
import Select from "react-select";

export default function Dice() {
  const { yDoc } = useContext(DocContext);
  const [isGmRoll, setIsGmRoll] = useState(false);
  const [canSetSides, isGm] = settingsStore((state) => [
    state.canSetSides,
    state.isGm
  ]);

  const { insert: insertHistory } = useYArray(yDoc.getArray("rolls"));
  const { data: yStats } = useYArray(yDoc.getArray("stats"));
  const { data: dice, set: setDice } = useYMap(yDoc.getMap("dice"));
  const { data: presets } = useYArray(yDoc.getArray("presets"));

  const selectOnChange = (event) => {
    const ids = event.reduce((a, e) => [...a, ...e.value], []);
    yStats.forEach((stat) => {
      stat.set("checked", ids.includes(stat.get("id")));
    });
  };

  const selectOptions = () => {
    const stats = yStats;
    const statOptions = stats.map((stat) => ({
      label: `${stat.get("name")} (${stat.get("value") || 0})`,
      value: [stat.get("id")]
    }));
    const presetOptions = presets.map((preset) => ({
      label: `${preset.get("name")} (${stats
        .filter((stat) =>
          preset.get("stats").toArray().includes(stat.get("id"))
        )
        .reduce((a, stat) => a + (+stat.get("value") || 0), 0)})`,
      value: preset.get("stats")
    }));
    return [...presetOptions, ...statOptions];
  };

  const selectAdapter = (stats) =>
    stats.map((stat) => ({
      label: `${stat.get("name")} (${stat.get("value") || 0})`,
      value: [stat.get("id")]
    }));

  const checkedPresets = yStats.filter((preset) => {
    return preset.get("checked") === true;
  });

  const allowManualRoll = checkedPresets.length === 0;

  const count = checkedPresets.reduce((a, p) => {
    const value = +p.get("value");
    return a + (isNaN(value) ? 0 : value);
  }, 0);

  const allowRoll = allowManualRoll ? dice.count > 0 : count > 0;

  const [die, setDie] = useState(10);
  const [exploding, setExploding] = useState(true);

  const roll = () => {
    const date = +new Date();
    const id = `${yDoc.clientID}-roll-${date}`;
    const difficulty = dice.difficulty || 0;

    const activePresets = checkedPresets.reduce((acc, preset) => {
      const name = preset.get("name");
      const value = preset.get("value");
      acc[name] = value;
      return acc;
    }, {});

    const meta = {
      gm: isGmRoll,
      date: date,
      manual: allowManualRoll,
      stats: activePresets
    };

    const rolls = [];
    let remaining = allowManualRoll ? dice.count : count;
    if (remaining <= 0) {
      return;
    }

    while (remaining) {
      remaining--;
      const result = Math.floor(random() * die) + 1;
      if (exploding && result === die) {
        remaining++;
      }
      rolls.push(result);
    }
    insertHistory(0, [{ id, rolls, exploding, difficulty, meta }]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <header>
        <Profile />
      </header>
      <main style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
        <label
          style={{ display: "block", padding: ".5rem", textAlign: "center" }}
        >
          <span style={{ display: "block" }}>
            {allowManualRoll ? "Roll (manual)" : `Roll`}
          </span>
          {allowManualRoll ? (
            <input
              type="number"
              value={dice.count || 0}
              min="0"
              style={{
                fontSize: "2rem",
                textAlign: "center",
                maxWidth: "100%",
                width: "100%",
                boxSizing: "border-box"
              }}
              onChange={(event) => setDice("count", event.target.value)}
              onFocus={(event) => event.target.select()}
            />
          ) : (
            <input
              type="number"
              value={count}
              placeholder="dice"
              readOnly={true}
              style={{
                fontSize: "2rem",
                textAlign: "center",
                boxSizing: "border-box",
                width: "100%",
                maxWidth: "100%"
              }}
            />
          )}
        </label>
        <Select
          options={selectOptions()}
          value={selectAdapter(checkedPresets)}
          isMulti={true}
          onChange={selectOnChange}
          placeholder="Select trait"
        />

        {canSetSides ? (
          <label
            style={{ display: "block", padding: ".5rem", textAlign: "center" }}
          >
            <span style={{ display: "block" }}>Sides</span>
            <input
              type="number"
              value={die}
              onChange={(event) => setDie(event.target.value)}
              placeholder="sides"
              style={{
                fontSize: "2rem",
                textAlign: "center",
                boxSizing: "border-box",
                width: "100%",
                maxWidth: "100%"
              }}
            />
          </label>
        ) : null}
        <label
          style={{ padding: ".5rem", display: "block", textAlign: "center" }}
        >
          <span style={{ display: "block" }}>Difficulty</span>
          <input
            type="number"
            value={dice.difficulty || 0}
            onChange={(event) => setDice("difficulty", event.target.value)}
            onFocus={(event) => event.target.select()}
            placeholder="difficulty"
            style={{
              fontSize: "2rem",
              textAlign: "center",
              boxSizing: "border-box",
              width: "100%",
              maxWidth: "100%"
            }}
          />
        </label>
        <div>
          <label
            style={{
              padding: ".5rem",
              textAlign: "center",
              userSelect: "none"
            }}
          >
            <input
              type="checkbox"
              checked={exploding}
              onChange={(event) => setExploding(event.target.checked)}
            />
            <span>&nbsp;Exploding on perfect!</span>
          </label>
          {isGm ? (
            <label
              style={{
                padding: ".5rem",
                textAlign: "center",
                userSelect: "none"
              }}
            >
              <input
                type="checkbox"
                checked={isGmRoll}
                onChange={(event) => setIsGmRoll(event.target.checked)}
              />
              <span>&nbsp;GM roll</span>
            </label>
          ) : null}
        </div>
        <button
          onClick={() => roll()}
          style={{
            fontSize: "1.5rem",
            padding: ".5rem 1rem",
            display: "block",
            marginTop: ".5rem",
            marginBottom: "1rem",
            maxWidth: "100%",
            width: "100%",
            boxSizing: "border-box"
          }}
          disabled={!allowRoll}
        >
          Roll {isGmRoll ? "hidden " : " "}
          {(allowManualRoll ? dice.count : count) || 0}d{die || 0}
          {exploding ? "!" : ""}&gt;={dice.difficulty || 0}
        </button>
      </main>
    </div>
  );
}
