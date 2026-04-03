import { r as reactExports, j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
function InputField({ label, error, helperText, registration, ...props }) {
  const generatedId = reactExports.useId();
  const fieldId = props.id || (registration == null ? void 0 : registration.name) || generatedId;
  const describedBy = error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : void 0;
  const { ref, ...registrationProps } = registration || {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field__label", htmlFor: fieldId, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", id: fieldId, "aria-invalid": Boolean(error), "aria-describedby": describedBy, ref, ...registrationProps, ...props }),
    error ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__error", id: `${fieldId}-error`, children: error }) : helperText ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__helper", id: `${fieldId}-helper`, children: helperText }) : null
  ] });
}
function SelectField({ label, error, helperText, children, registration, ...props }) {
  const generatedId = reactExports.useId();
  const fieldId = props.id || (registration == null ? void 0 : registration.name) || generatedId;
  const describedBy = error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : void 0;
  const { ref, ...registrationProps } = registration || {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field__label", htmlFor: fieldId, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "select", id: fieldId, "aria-invalid": Boolean(error), "aria-describedby": describedBy, ref, ...registrationProps, ...props, children }),
    error ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__error", id: `${fieldId}-error`, children: error }) : helperText ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__helper", id: `${fieldId}-helper`, children: helperText }) : null
  ] });
}
function TextAreaField({ label, error, helperText, registration, ...props }) {
  const generatedId = reactExports.useId();
  const fieldId = props.id || (registration == null ? void 0 : registration.name) || generatedId;
  const describedBy = error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : void 0;
  const { ref, ...registrationProps } = registration || {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field__label", htmlFor: fieldId, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: "textarea",
        id: fieldId,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
        ref,
        ...registrationProps,
        ...props
      }
    ),
    error ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__error", id: `${fieldId}-error`, children: error }) : helperText ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__helper", id: `${fieldId}-helper`, children: helperText }) : null
  ] });
}
export {
  InputField as I,
  SelectField as S,
  TextAreaField as T
};
