import { r as reactExports, a as reactDomExports, j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
function getFocusableElements(container) {
  if (!container) {
    return [];
  }
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("aria-hidden"));
}
function Modal({ open, title, description, onClose, children, footer, size = "md" }) {
  const titleId = reactExports.useId();
  const descriptionId = reactExports.useId();
  const panelRef = reactExports.useRef(null);
  const closeButtonRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const initialFocusTarget = getFocusableElements(panelRef.current)[0] || closeButtonRef.current || panelRef.current;
    initialFocusTarget == null ? void 0 : initialFocusTarget.focus();
    function handleKeyDown(event) {
      if (!panelRef.current) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const focusableElements = getFocusableElements(panelRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement == null ? void 0 : previousActiveElement.focus();
    };
  }, [onClose, open]);
  if (!open || typeof document === "undefined") {
    return null;
  }
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onMouseDown: (event) => event.target === event.currentTarget ? onClose() : void 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: panelRef,
        className: `modal-panel modal-panel--${size}`,
        onMouseDown: (event) => event.stopPropagation(),
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        "aria-describedby": description ? descriptionId : void 0,
        tabIndex: -1,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-panel__header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: titleId, children: title }),
              description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: descriptionId, children: description }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ref: closeButtonRef, type: "button", className: "ghost-button modal-panel__close", onClick: onClose, "aria-label": "Close dialog", children: "Close" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-panel__body", children }),
          footer ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-panel__footer", children: footer }) : null
        ]
      }
    ) }),
    document.body
  );
}
function SegmentedControl({ value, label, options, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "segmented-control", role: "tablist", "aria-label": label, children: options.map((option) => {
    const selected = option.value === value;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": selected,
        className: selected ? "segmented-control__option segmented-control__option--active" : "segmented-control__option",
        onClick: () => onChange(option.value),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: option.label }),
          option.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: option.description }) : null
        ]
      },
      option.value
    );
  }) });
}
export {
  Modal as M,
  SegmentedControl as S
};
