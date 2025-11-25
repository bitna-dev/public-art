import App from "./components/App.js";
import "./global.css";

import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("react-container"));
root.render(<App />);
