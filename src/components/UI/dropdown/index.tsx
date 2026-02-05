import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { checkMarkSvg, closeSvg } from "./images";
import * as styles from "./index.scss";
import { DropdownOption, DropdownProps } from "./types";


const DEFAULT_FONT = "14px Arial";

function uniqByValue(items: DropdownOption[]): DropdownOption[] {
  const seen = new Set<DropdownOption["value"]>();
  const out: DropdownOption[] = [];
  for (const it of items) {
    if (seen.has(it.value)) continue;
    seen.add(it.value);
    out.push(it);
  }
  return out;
}

const normalize = (s: string) => s.trim().toLowerCase();

const Dropdown = ({
  options,
  onChange,
  onNewItemAdded,
  defaultValue,
  maxWidthSelectedItem = 400,
  width = 500,
}: DropdownProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [addedItems, setAddedItems] = useState<DropdownOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState<DropdownOption[]>(
    defaultValue ?? []
  );

  useEffect(() => {
    if (defaultValue) setSelectedItems(defaultValue);
  }, [defaultValue]);

  const allItems = useMemo(
    () => uniqByValue([...(options ?? []), ...addedItems]),
    [options, addedItems]
  );

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    onChange?.(selectedItems);
  }, [onChange, selectedItems]);

  const itemsToShow = useMemo(() => {
    const q = normalize(searchText);
    if (!q) return allItems;
    return allItems.filter((it) => normalize(it.label).includes(q));
  }, [allItems, searchText]);

  const isSelected = useCallback(
    (item: DropdownOption) => selectedItems.some((s) => s.value === item.value),
    [selectedItems]
  );

  const toggleItem = useCallback((item: DropdownOption) => {
    setSelectedItems((prev) => {
      const exists = prev.some((p) => p.value === item.value);
      return exists
        ? prev.filter((p) => p.value !== item.value)
        : [...prev, item];
    });
  }, []);

  const measureText = useCallback((text: string) => {
    if (!canvasRef.current)
      canvasRef.current = document.createElement("canvas");
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return text.length * 8;
    ctx.font = DEFAULT_FONT;
    return ctx.measureText(text).width;
  }, []);

  const visibleSelectedItems = useMemo(() => {
    const out: DropdownOption[] = [];
    let used = 0;
    for (const it of selectedItems) {
      const w = measureText(it.label) + 30;
      if (used + w > maxWidthSelectedItem) break;
      out.push(it);
      used += w;
    }
    return out;
  }, [maxWidthSelectedItem, measureText, selectedItems]);

  const hiddenSelectedCount =
    selectedItems.length - visibleSelectedItems.length;

  const focusInputSoon = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    focusInputSoon();
  }, [focusInputSoon]);

  const toggleOpen = useCallback(() => {
    setIsOpen((v) => {
      const next = !v;
      if (next) focusInputSoon();
      return next;
    });
  }, [focusInputSoon]);

  const clearSelected = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedItems([]);
  }, []);

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const addOrSelectBySearch = useCallback(() => {
    const label = searchText.trim();
    if (!label) return;
    const norm = normalize(label);
    const alreadySelected = selectedItems.some(
      (s) => normalize(s.label) === norm
    );
    if (alreadySelected) {
      setSearchText("");
      return;
    }
    const existing = allItems.find((it) => normalize(it.label) === norm);
    if (existing) {
      setSelectedItems((prev) => [...prev, existing]);
      setSearchText("");
      return;
    }
    const newItem: DropdownOption = { label, value: label };
    setAddedItems((prev) => {
      const next = uniqByValue([...prev, newItem]);
      onNewItemAdded?.(newItem, uniqByValue([...(options ?? []), ...next]));
      return next;
    });
    setSelectedItems((prev) => [...prev, newItem]);
    setSearchText("");
  }, [allItems, options, onNewItemAdded, searchText, selectedItems]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addOrSelectBySearch();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [addOrSelectBySearch]
  );

  return (
    <div className={styles["select-container"]} style={{ width }} ref={rootRef}>
      <div className={styles["select-field-container"]}>
        <div
          className={styles["select-field"]}
          onClick={toggleOpen}
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleOpen();
            }
          }}
        >
          <div className={styles["select-field-selector"]}>
            {visibleSelectedItems.map((item) => (
              <div
                className={styles["select-selection-overflow-item"]}
                key={item.value}
              >
                <span className={styles["select-selection-item"]}>
                  {item.label}
                </span>
              </div>
            ))}

            <div className={styles["select-selection-overflow-item"]}>
              <div
                className={`${styles["select-selection-item"]} ${
                  hiddenSelectedCount > 0 ? "" : styles["display-none"]
                }`}
              >
                <span>+{hiddenSelectedCount}...</span>
              </div>
            </div>

            <input
              ref={inputRef}
              onChange={onSearchChange}
              onKeyDown={onKeyDown}
              value={searchText}
              onFocus={open}
              placeholder={selectedItems.length === 0 ? "Select..." : ""}
            />
          </div>

          <div className={styles["select-arrow-container"]}>
            <span
              className={`${styles["select-arrow"]} ${
                isOpen ? styles["select-arrow-up"] : styles["select-arrow-down"]
              }`}
            />
          </div>

          <span
            className={`${styles["select-clear"]} ${
              !selectedItems.length ? styles["display-none"] : ""
            }`}
            onClick={clearSelected}
            role="button"
            tabIndex={0}
            aria-label="Clear selection"
          >
            {closeSvg}
          </span>
        </div>
      </div>

      <div
        className={`${styles["select-item-options-container"]} ${
          !isOpen ? styles["display-none"] : ""
        }`}
        role="listbox"
        aria-multiselectable="true"
      >
        {itemsToShow.length ? (
          itemsToShow.map((item) => {
            const selected = isSelected(item);
            return (
              <div
                className={`${styles["select-item-options"]} ${
                  selected ? styles["select-item-options-selected"] : ""
                }`}
                key={item.value}
                onClick={() => toggleItem(item)}
                role="option"
                aria-selected={selected}
              >
                <span>{item.label}</span>
                {item.icon ? <img src={item.icon} alt="" /> : null}
                {selected ? checkMarkSvg : null}
              </div>
            );
          })
        ) : (
          <span
            className={`${itemsToShow.length ? styles["display-none"] : ""}`}
          >
            No results found.
          </span>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
