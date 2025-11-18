import React from "react";
import { ActionIcon, Checkbox, Group, Menu, Radio } from "@mantine/core";
import { GearIcon } from "@phosphor-icons/react";
import { ResultsDisplayType } from "../types.ts";
import { config } from "../config.tsx";
import useUserSettings from "../hooks/useUserSettings.ts";

import classes from "./UserSettingsMenu.module.css";

const UserSettingsMenu: React.FC = () => {
  const visibleFields = useUserSettings((state) => state.visibleFields);
  const toggleField = useUserSettings((state) => state.toggleField);
  const resultsDisplayType = useUserSettings(
    (state) => state.resultsDisplayType,
  );
  const setResultsDisplayType = useUserSettings(
    (state) => state.setResultsDisplayType,
  );

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
          <Checkbox.Card
            key={field.field}
            withBorder={false}
            checked={visibleFields.includes(field.field)}
            onChange={() => toggleField(field.field)}
          >
            <Group
              className={classes.menuInput}
              wrap="nowrap"
              align="center"
              gap="sm"
            >
              <Checkbox.Indicator />
              {field.label}
            </Group>
          </Checkbox.Card>
        ))}
        <Menu.Divider />
        <Menu.Label>Results Display</Menu.Label>
        <Radio.Group
          value={resultsDisplayType}
          onChange={(value) =>
            setResultsDisplayType(value as ResultsDisplayType)
          }
        >
          {Object.values(ResultsDisplayType).map((type) => (
            <Radio.Card key={type} withBorder={false} value={type}>
              <Group
                className={classes.menuInput}
                wrap="nowrap"
                align="center"
                gap="sm"
              >
                <Radio.Indicator />
                {type}
              </Group>
            </Radio.Card>
          ))}
        </Radio.Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserSettingsMenu;
