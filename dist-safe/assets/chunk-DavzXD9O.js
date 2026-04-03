import { r as reactExports, u as useForm, j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
import { I as InputField } from "./chunk-Nxb3cxB-.js";
import { u as useAuth, h as useToast, t as demoAccounts, p as platformService, v as normalizeApiError } from "./app-C4Pvg4H3.js";
import { a as useNavigate, u as useLocation } from "./chunk-CzznHu47.js";
import "./chunk-DYvrnLMg.js";
import "./chunk-BFW3X9Eb.js";
function Login() {
  var _a, _b;
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status } = useAuth();
  const { showToast } = useToast();
  const [submitError, setSubmitError] = reactExports.useState(null);
  const [demoStatus, setDemoStatus] = reactExports.useState(null);
  const [pendingDemoAccount, setPendingDemoAccount] = reactExports.useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadDemoStatus() {
      try {
        const status2 = await platformService.getDemoStatus();
        if (isMounted) {
          setDemoStatus(status2);
        }
      } catch {
        if (isMounted) {
          setDemoStatus(null);
        }
      }
    }
    void loadDemoStatus();
    return () => {
      isMounted = false;
    };
  }, []);
  async function signIn(userNameOrEmail, password) {
    var _a2;
    const redirectPath = ((_a2 = location.state) == null ? void 0 : _a2.from) || "/dashboard";
    setSubmitError(null);
    try {
      await login(userNameOrEmail, password);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setSubmitError(normalizedError.message);
      showToast("Sign in failed", normalizedError.message, "danger");
    }
  }
  async function onSubmit(values) {
    setPendingDemoAccount(null);
    await signIn(values.username, values.password);
  }
  async function signInWithDemoAccount(account) {
    setPendingDemoAccount(account.userNameOrEmail);
    await signIn(account.userNameOrEmail, account.password);
    setPendingDemoAccount(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "auth-page__hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-page__intro", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "page-header__eyebrow", children: "Edgeonix ERP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Run revenue, operations, finance, and service from one connected business platform." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sign in to manage daily work, review business performance, and keep every team operating from the same source of truth." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-page__highlights", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Access by role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Each person sees the pages and actions that match their responsibilities and approvals." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Connected workflows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sales, stock, purchasing, finance, and service stay connected across one organization-wide system." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Operational visibility" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Dashboards, alerts, and audit history help teams spot priorities and act with confidence." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "auth-page__panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "page-header__eyebrow", children: "Sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Access your organization" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Use your business email or username to continue." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "form-grid", onSubmit: handleSubmit(onSubmit), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InputField,
          {
            label: "Email or username",
            placeholder: "Enter your email or username",
            autoComplete: "username",
            error: (_a = errors.username) == null ? void 0 : _a.message,
            registration: register("username", { required: "Please enter your email or username." })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InputField,
          {
            label: "Password",
            type: "password",
            placeholder: "Enter password",
            autoComplete: "current-password",
            error: (_b = errors.password) == null ? void 0 : _b.message,
            registration: register("password", { required: "Please enter your password." })
          }
        ),
        submitError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-alert form-alert--danger", children: submitError }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "primary-button", disabled: status === "loading", children: status === "loading" ? "Signing in..." : "Sign in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-card__demo", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-card__demo-copy", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Explore the sample organization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Demo mode is enabled. Use any sample login below to open a fully working in-browser business scenario without live API access." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "auth-card__demo-credentials", children: demoAccounts.map((account) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-card__demo-credential", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: account.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "User ID: ",
            account.userNameOrEmail
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Password: ",
            account.password
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: account.description })
        ] }, `${account.label}-credentials`)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "demo-login-grid", children: demoAccounts.map((account) => {
          const isCurrent = pendingDemoAccount === account.userNameOrEmail;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "demo-login-button",
              disabled: status === "loading",
              onClick: () => void signInWithDemoAccount(account),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isCurrent && status === "loading" ? `Signing in as ${account.label}...` : `Demo ${account.label}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: account.description })
              ]
            },
            account.userNameOrEmail
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-card__footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Need help signing in?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Contact your organization administrator" })
      ] })
    ] }) })
  ] });
}
export {
  Login as default
};
