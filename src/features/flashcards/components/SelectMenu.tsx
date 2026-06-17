"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectMenuProps<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
};

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="select-menu-chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="select-menu-check"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 12 4 4 8-8" />
    </svg>
  );
}

export function SelectMenu<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SelectMenuProps<T>) {
  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const selectedOption = options[selectedIndex];

  function openMenu() {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const estimatedMenuHeight = Math.min(options.length * 48 + 12, 270);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openUpward =
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

    setActiveIndex(selectedIndex);

    setMenuStyle({
      left: rect.left,
      width: rect.width,
      top: openUpward ? rect.top - 8 : rect.bottom + 8,
      transform: openUpward ? "translateY(-100%)" : undefined,
    });

    setIsOpen(true);
  }

  function closeMenu(returnFocus = false) {
    setIsOpen(false);

    if (returnFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  function selectOption(option: SelectOption<T>) {
    onChange(option.value);
    closeMenu(true);
  }

  function handleTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      setActiveIndex((current) =>
        Math.min(current + 1, options.length - 1),
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (
      isOpen &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      selectOption(options[activeIndex]);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleOutsideClick(event: PointerEvent) {
      const target = event.target as Node;

      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      closeMenu();
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    }

    function handleViewportChange() {
      closeMenu();
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick,
      );
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener(
        "scroll",
        handleViewportChange,
        true,
      );
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [isOpen]);

  return (
    <div className="select-menu">
      <button
        ref={triggerRef}
        className="select-menu-trigger"
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => {
          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selectedOption.label}</span>
        <ChevronIcon />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            className="select-menu-options"
            role="listbox"
            aria-label={ariaLabel}
            style={menuStyle}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <button
                  key={option.value}
                  className={`select-menu-option ${
                    isSelected ? "selected" : ""
                  } ${isActive ? "active" : ""}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  <span>{option.label}</span>

                  {isSelected && <CheckIcon />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}