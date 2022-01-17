import { createContext } from "react";
import ContextType from "../types/ContextType";

const Context = createContext<ContextType>({
  UserNameContext: ["", () => {}],
  ShowAlertContext: [false, () => {}],
  ModeDisabledContext: [false, () => {}],
});

export default Context;
