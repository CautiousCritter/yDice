import { useContext } from "react";
import { DocContext } from "./Editor";
import { useYArray, useYMap } from "zustand-yjs";
import { settingsStore } from "./store";

export default function Profiles() {
  const { yDoc } = useContext(DocContext);
  const { data: profiles } = useYArray(yDoc.getArray("profiles"));
  const isGm = settingsStore((state) => state.isGm);
  const { data: dice, set: setDice } = useYMap(yDoc.getMap("dice"));

  return (
    <>
      <select
        onChange={(event) => setDice.set("profile", event.target.value)}
        value={dice.profile || -1}
      >
        <option value="-1">None</option>
        {profiles
          .filter((profile) => (profile.gm ? isGm : true))
          .map((profile) => (
            <option value={profile.id}>{profile.name}</option>
          ))}
      </select>
    </>
  );
}
