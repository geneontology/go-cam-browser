import { ActionIcon, Checkbox, Menu } from "@mantine/core";
import { GearIcon } from "@phosphor-icons/react";
import type { IndexedGoCam } from "../types.ts";
import { config } from "../config.tsx";

interface ConfigMenuProps<TData> {
  visibleFields: (keyof TData)[];
  onToggleField: (field: keyof TData) => void;
}

const ConfigMenu: React.FC<ConfigMenuProps<IndexedGoCam>> = ({
  onToggleField,
  visibleFields,
}) => {
  return (
    <Menu shadow="md" position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="light" size="input-lg">
          <GearIcon size="70%" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Visible Fields</Menu.Label>
        {config.fields.map((field) => (
          <Menu.Item key={field.field} closeMenuOnClick={false}>
            <Checkbox
              checked={visibleFields.includes(field.field)}
              onChange={() => onToggleField(field.field)}
              label={field.label}
            />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ConfigMenu;
