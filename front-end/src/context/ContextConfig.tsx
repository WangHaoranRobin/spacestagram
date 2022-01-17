import { createContext } from "react";

export const UserNameContext = createContext<
  [string, React.Dispatch<React.SetStateAction<string>>]
>(["", () => {}]);

export const ShowAlertContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);
