export interface DropdownOption {
  label: string;
  value: string | number;
  icon?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  onChange?: (selected: DropdownOption[]) => void;
  onNewItemAdded?: (
    newItem: DropdownOption,
    allItems: DropdownOption[]
  ) => void;
  defaultValue?: DropdownOption[];
  maxWidthSelectedItem?: number;
  width?: number;
}
