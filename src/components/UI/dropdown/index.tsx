import React, { useEffect, useState, useRef, ChangeEvent, useMemo  } from "react";
import {checkMarkSvg, closeSvg} from './images'
import * as styles from "./index.scss";
interface Item {
  label: string;
  value: string|number;
  icon?: string;
}
interface Props {
  items: Item[];
  onChange?: (selected: Item[]) => void;
  onNewItemAdded?: (newItem: Item, allItems: Item[]) => void;
  defaultValue?: Item[];
  maxWidthSelectedItem?: number
  width?:number
}

const DropDown = (props: Props) => {
  const {
    items = [],
    onChange,
    onNewItemAdded,
    defaultValue,
    maxWidthSelectedItem = 400,
    width=500
  } = props;
  const selectFieldRef = useRef(null);
  const [showDropdownList, setShowDropdownList] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const allItems = useMemo(() => [...items], [items])
  const [itemsToShow, setItemsToShow] = useState<Item[]>(items);
  const [selectedItems, setSelectedItems] = useState<Item[]>(defaultValue||[]);
  useEffect(() => {
    const clickOutsideHandler = (e: any) => {
      if (
        selectFieldRef.current &&
        !selectFieldRef.current.contains(e.target)
      ) {
        setShowDropdownList(false);
      }
    };
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, []);
  useEffect(() => {
    if (onChange) onChange(selectedItems);
  }, [selectedItems]);
  useEffect(() => {
    setItemsToShow(
      allItems.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText]);
  const selectItemHandler = (item: Item) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem.value === item.value
    );
    setSelectedItems((prevItems) =>
      isSelected
        ? prevItems.filter(({ value }) => value !== item.value)
        : [...prevItems, item]
    );
  };
  const getTextWidth = (text:string) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = `14px Arial`
    const width = context.measureText(text).width
    return width
  }
  const getSelectedItemToShow =useMemo(() => {
    const selectedItem = selectedItems?.reduce(
      (acc, item) => {
        const itemWidth = getTextWidth(item.label) + 30
        if (acc.totalWidth + itemWidth <= maxWidthSelectedItem) {
            acc.selectedItem.push(item)
            acc.totalWidth += itemWidth
        }
        return acc
      },
      { selectedItem: [], totalWidth: 0 }
    ).selectedItem
    return selectedItem
  }, [selectedItems])
  const getNotShowItems = useMemo(
    () => (selectedItems.length || 0) - (getSelectedItemToShow?.length || 0),
    [getSelectedItemToShow, selectedItems]
  )  
  const dropdownHandler = () => {
    setShowDropdownList((prevState) =>
      prevState === false ? true : prevState
    );
  };
  const clearSelectedItems = () => {
    setSelectedItems([]);
  };
  const onSearchChange = (e:ChangeEvent<HTMLInputElement> ) => {
    setSearchText(e.target.value);
  };
  const enterKeyHandler = e => {
    if (e.key === "Enter" && searchText) {
      const isTitleExists = selectedItems.some(
        (selectedItem) =>
          selectedItem.label.toLowerCase() === searchText.toLowerCase()
      );      
      if (!isTitleExists) {
        const currentItem = allItems.find(
        (allItem) =>
          allItem.label.toLowerCase() === searchText.toLowerCase()
        );
        const newItem = { label: searchText, value: searchText };
        setSelectedItems((prevItems) => [...prevItems, currentItem||newItem]);
        if(!currentItem)
        { 
          allItems.push(newItem)
          if(onNewItemAdded) onNewItemAdded(newItem,allItems) 
        }   
      }
      setSearchText("");
    }
  };
  return (
    <div className={styles['select-container']} style={{width}} ref={selectFieldRef}>
      <div className={styles["select-field-container"]}>
        <div className={styles["select-field"]} onClick={dropdownHandler}>
          <div className={styles["select-field-selector"]}>
            {getSelectedItemToShow?.map((item) => {
              return (
                <div
                  className={styles["select-selection-overflow-item"]}
                  key={item.value}
                >
                  <span className={styles["select-selection-item"]}>
                    {item.label}
                  </span>
                </div>
              );
            })}  
            <div
                  className={styles["select-selection-overflow-item"]}
                >         
            <div className={`${styles['select-selection-item']} ${getNotShowItems > 0?'':styles['display-none']}`}>
                <span>+{getNotShowItems}...</span>
            </div>
            </div>
            <input
              onChange={onSearchChange}
              onKeyDown={enterKeyHandler}
              value={searchText}
            />
          </div>
          <div className={styles["select-arrow-container"]}>
            <span
              className={`${styles['select-arrow']} ${
                showDropdownList ? styles["select-arrow-up"] : styles["select-arrow-down"]
              }`}
            />
          </div>
          <span
            className={`${styles['select-clear']} ${
              !selectedItems.length && styles["display-none"]
            }`}
            onClick={clearSelectedItems}
          >
            {closeSvg}
          </span>
        </div>
      </div>
      <div
        className={`${styles['select-item-options-container']} ${
          !showDropdownList && styles["display-none"]
        }`}
      >
        {itemsToShow.map((item) => {
          const isSelectedItem = selectedItems.find(
            (selectedItem) => selectedItem.value === item.value
          );
          return (
            <div
              className={`${styles['select-item-options']} ${
                isSelectedItem && styles["select-item-options-selected"]
              }`}
              key={item.value}
              onClick={() => selectItemHandler(item)}
            >
              <span>{isSelectedItem?`Yeeeah, ${item.label.toLowerCase()}!`:item.label}</span>
              <img src={item.icon}/>
              {isSelectedItem && (
                checkMarkSvg
              )}
            </div>
          );
        })}
        <span className={`${itemsToShow.length && styles["display-none"]}`}>
          No items.
        </span>
      </div>
    </div>
  );
};
export default DropDown;
