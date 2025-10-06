import { IVariable } from './variables.types';

export interface VariableListProps {
  variables: IVariable[];
  selectedIndex: number;
  onVariableSelect: (variable: IVariable) => void;
}
