import { useMemo } from "react";

export default function ({ rolls, exploding, difficulty, meta: { gm } }) {
  const successes = useMemo(
    () => rolls.reduce((a, v) => (v >= difficulty ? a + 1 : a), 0),
    [rolls, difficulty]
  );

  return (
    <>
      <span style={{ fontSize: "2rem", padding: "1rem" }}>{successes}</span>
      {rolls.map((roll, index) => (
        <span
          key={index}
          className="die"
          style={{
            display: "inline-block",
            fontSize: "1.2rem",
            margin: ".25rem",
            padding: ".25rem",
            fontWeight: roll >= difficulty ? "bold" : "normal",
            backgroundColor: "white",
            filter: roll >= difficulty ? "invert(100%)" : "none",
            width: "1.5rem",
            height: "1.5rem",
            textAlign: "center",
            lineHeight: "1.5rem"
          }}
        >
          {roll}
        </span>
      ))}
    </>
  );
}
