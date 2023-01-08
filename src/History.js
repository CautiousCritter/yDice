import { useContext } from "react";
import { useYArray } from "zustand-yjs";
import { DocContext } from "./Editor";
import Roll from "./Roll";
import { settingsStore } from "./store";
import Visibility from "./Utils/Visibility";
import { memo } from "react";

const Meta = memo(function ({ date, manual, stats }) {
  const dateObj = new Date(0);
  dateObj.setUTCMilliseconds(date);
  const localTime = dateObj.toLocaleTimeString();
  const localDate = dateObj.toLocaleDateString();
  return (
    <div style={{ paddingLeft: "4rem" }}>
      <span>{localTime}</span>&nbsp;<span>{localDate}</span>&nbsp;
      <span>
        {manual
          ? "(manual)"
          : `(${Object.entries(stats || {})
              .map(([stat, val]) => `${val} ${stat}`)
              .join(" + ")})`}
      </span>
    </div>
  );
});

export default function History() {
  const { yDoc } = useContext(DocContext);
  const { data: rolls, delete: deleteRoll } = useYArray(yDoc.getArray("rolls"));
  const [isGm, detailedHistory] = settingsStore((state) => [
    state.isGm,
    state.detailedHistory
  ]);

  return (
    <ul>
      {rolls.map((roll, index) =>
        (roll.meta.gm ? isGm : true) ? (
          <li
            key={roll.id}
            style={{ border: roll.meta.gm ? "1px dashed black" : "none" }}
            className="history-item"
          >
            <Visibility state={(state) => state.canDelete}>
              <button onClick={() => deleteRoll(index)}>delete</button>
            </Visibility>
            <Roll {...roll} />
            {detailedHistory ? <Meta {...roll.meta} /> : null}
          </li>
        ) : null
      )}
    </ul>
  );
}
