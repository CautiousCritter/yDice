import { settingsStore } from "../store";

export default function Visibility({ state, children }) {
  const visibility = settingsStore(state);
  return visibility ? children : null;
}
