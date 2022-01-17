export default interface ContextType {
  UserNameContext: [string, React.Dispatch<React.SetStateAction<string>>];
  ShowAlertContext: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  ModeDisabledContext: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
