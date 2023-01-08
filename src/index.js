import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
// ReactDOM.render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
//   rootElement
// );
const root = createRoot(rootElement);
root.render(<App />);
