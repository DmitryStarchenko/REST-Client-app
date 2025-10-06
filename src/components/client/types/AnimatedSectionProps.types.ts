import { ActiveSection } from './ActiveSection.type';

export interface AnimatedSectionProps {
  activeSection: ActiveSection;
  direction: number;
  requestSection: React.ReactNode;
  responseSection: React.ReactNode;
}
