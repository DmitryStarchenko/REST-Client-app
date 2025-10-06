export interface BodyActionsProps {
  onCopyBase64: () => void;
  onPrettifyJson: () => void;
  canPrettify: boolean;
  hasJsonError: boolean;
  hasBodyText: boolean;
}
