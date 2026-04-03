import { r as reactExports, j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
function AIAssistant({
  title = "Ask ERP",
  description = "Ask simple questions about the information on this page.",
  initialMessage,
  placeholder = "Ask about the information on this page",
  suggestions = [],
  generateResponse
}) {
  const [draft, setDraft] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([
    {
      id: "assistant-intro",
      role: "assistant",
      content: initialMessage
    }
  ]);
  async function ask(question) {
    if (!question.trim()) {
      return;
    }
    const sanitizedQuestion = question.trim();
    setLoading(true);
    try {
      const response = await Promise.resolve(generateResponse(sanitizedQuestion));
      reactExports.startTransition(() => {
        setMessages((current) => [
          ...current,
          { id: crypto.randomUUID(), role: "user", content: sanitizedQuestion },
          { id: crypto.randomUUID(), role: "assistant", content: response }
        ]);
        setDraft("");
      });
    } finally {
      setLoading(false);
    }
  }
  async function handleAsk(event) {
    event.preventDefault();
    await ask(draft);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "assistant-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "assistant-card__header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: description })
    ] }) }),
    suggestions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "assistant-card__suggestions", children: suggestions.map((suggestion) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => void ask(suggestion), children: suggestion }, suggestion)) }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "assistant-card__messages", children: messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `assistant-card__message assistant-card__message--${message.role}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: message.role === "assistant" ? "ERP Assistant" : "You" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: message.content })
    ] }, message.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "assistant-card__composer", onSubmit: handleAsk, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          value: draft,
          onChange: (event) => setDraft(event.target.value),
          placeholder
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "primary-button", disabled: loading, children: loading ? "Getting answer..." : "Ask" })
    ] })
  ] });
}
export {
  AIAssistant as A
};
