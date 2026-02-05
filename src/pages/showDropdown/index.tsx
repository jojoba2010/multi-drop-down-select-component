import React from "react";
import Dropdown from "../../components/UI/dropdown";
import { mockData } from "./mock";
import { DropdownOption } from "components/UI/dropdown/types";

const ShowDropdown = () => {
  const onChangeDropdown = (slectedValues: DropdownOption[]) => {
    console.log("slectedValues##", slectedValues);
  };
  const onNewItemAdded = (
    newItem: DropdownOption,
    allItems: DropdownOption[]
  ) => {
    console.log("newItem##", newItem, "All options##", allItems);
  };
  return (
    <Dropdown
      options={mockData}
      onChange={onChangeDropdown}
      onNewItemAdded={onNewItemAdded}
      defaultValue={[
        {
          label: "Science",
          value: "science",
        },
      ]}
    />
  );
};

export default ShowDropdown;
