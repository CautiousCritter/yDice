import { settingsStore } from "./store";

function Checkbox({ title, checked, onChange }) {
  return (
    <label style={{ userSelect: "none" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      &nbsp;{title}
    </label>
  );
}

export default function Settings() {
  const {
    canDelete,
    canSetSides,
    setCanDelete,
    setCanSetSides,
    isGm,
    setIsGm,
    detailedHistory,
    setDetailedHistory
  } = settingsStore((state) => state);
  return (
    <>
      <Checkbox
        title="Allow deletion"
        onChange={setCanDelete}
        checked={canDelete}
      />
      <Checkbox
        title="Dice sides"
        onChange={setCanSetSides}
        checked={canSetSides}
      />
      <Checkbox
        title="Detailed history"
        onChange={setDetailedHistory}
        checked={detailedHistory}
      />
      <Checkbox title="GM mode" onChange={setIsGm} checked={isGm} />
    </>
  );
}
