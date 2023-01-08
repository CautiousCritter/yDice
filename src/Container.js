import { useState } from "react";

export default function Container({ title, hide, children }) {
  const [visible, setVisible] = useState(!hide);
  return (
    <div
      className="container"
      style={{
        display: "block",
        pageBreakInside: "avoid",
        breakInside: "avoid-column"
      }}
    >
      <button
        onClick={() => setVisible((p) => !p)}
        style={{ display: "block", width: "100%" }}
      >
        {visible ? "hide" : "show"}&nbsp;{title}
      </button>
      {visible ? (
        <div style={{ marginTop: ".5rem", marginBottom: "1.2rem" }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
