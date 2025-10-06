import { ActiveSection } from './ActiveSection.type';

export interface SectionNavigatorProps {
  activeSection: ActiveSection;
  onToggle: () => void;
  onSectionChange: (section: ActiveSection, direction: number) => void;
}
