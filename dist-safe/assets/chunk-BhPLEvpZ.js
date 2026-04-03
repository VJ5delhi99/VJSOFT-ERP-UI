import { r as reactExports, j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
import { E as EmptyState } from "./chunk-CaIpWVc3.js";
function getValueByPath(target, path) {
  return path.split(".").reduce((current, key) => {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    return current[key];
  }, target);
}
function compareValues(left, right) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  return String(left ?? "").localeCompare(String(right ?? ""));
}
function resolveAriaSort(sortKey, sortDirection, columnKey) {
  if (sortKey !== columnKey) {
    return "none";
  }
  return sortDirection === "asc" ? "ascending" : "descending";
}
function TableSkeleton({ columnCount, rowCount }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-skeleton", role: "presentation", "aria-hidden": "true", children: Array.from({ length: rowCount }).map((_, rowIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "table-skeleton__row",
      style: { gridTemplateColumns: `repeat(${Math.max(columnCount, 1)}, minmax(0, 1fr))` },
      children: Array.from({ length: columnCount }).map((__, columnIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "skeleton table-skeleton__cell" }, `skeleton-cell-${rowIndex}-${columnIndex}`))
    },
    `skeleton-row-${rowIndex}`
  )) });
}
function DataTable({
  columns,
  data,
  rowKey,
  title,
  description,
  loading = false,
  searchKeys = [],
  searchPlaceholder = "Search this list",
  toolbar,
  emptyTitle = "Nothing to show",
  emptyDescription = "Try a different search or check back when more information is available.",
  pageSizeOptions = [5, 10, 20],
  initialPageSize = 10,
  onRowClick
}) {
  const searchId = reactExports.useId();
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState(null);
  const [sortDirection, setSortDirection] = reactExports.useState("asc");
  const [page, setPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(initialPageSize);
  const deferredSearch = reactExports.useDeferredValue(searchTerm);
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  reactExports.useEffect(() => {
    setPage(1);
  }, [normalizedSearch, data.length, pageSize]);
  const filteredRows = reactExports.useMemo(
    () => searchKeys.length === 0 || normalizedSearch.length === 0 ? data : data.filter(
      (row) => searchKeys.some((key) => String(getValueByPath(row, key) ?? "").toLowerCase().includes(normalizedSearch))
    ),
    [data, normalizedSearch, searchKeys]
  );
  const sortedRows = reactExports.useMemo(() => {
    if (!sortKey) {
      return filteredRows;
    }
    return [...filteredRows].sort((left, right) => {
      const result = compareValues(getValueByPath(left, sortKey), getValueByPath(right, sortKey));
      return sortDirection === "asc" ? result : result * -1;
    });
  }, [filteredRows, sortDirection, sortKey]);
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedRows = reactExports.useMemo(() => sortedRows.slice(pageStart, pageStart + pageSize), [pageSize, pageStart, sortedRows]);
  const pageEnd = sortedRows.length === 0 ? 0 : Math.min(pageStart + pageSize, sortedRows.length);
  function resolveRowKey(row) {
    return typeof rowKey === "function" ? rowKey(row) : String(row[rowKey]);
  }
  function handleSort(column) {
    if (!column.sortable) {
      return;
    }
    if (sortKey === column.key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(column.key);
    setSortDirection("asc");
  }
  function handleRowKeyDown(event, row) {
    if (!onRowClick) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  }
  const totalLabel = `${sortedRows.length} ${sortedRows.length === 1 ? "item" : "items"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "table-card", "aria-busy": loading, children: [
    (title || description || searchKeys.length > 0 || toolbar) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-card__header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        title ? /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: title }) : null,
        description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: description }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-card__toolbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-chip status-chip--neutral", children: totalLabel }),
        searchKeys.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-search", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "visually-hidden", htmlFor: searchId, children: searchPlaceholder }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: searchId,
              className: "input",
              value: searchTerm,
              onChange: (event) => setSearchTerm(event.target.value),
              placeholder: searchPlaceholder
            }
          )
        ] }) : null,
        toolbar
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { columnCount: columns.length, rowCount: Math.min(pageSize, 6) }) }) : pagedRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: emptyTitle, description: emptyDescription, compact: true }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "data-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("caption", { className: "visually-hidden", children: title || description || "Table view" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: columns.map((column) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            style: { width: column.width },
            scope: "col",
            "aria-sort": resolveAriaSort(sortKey, sortDirection, column.key),
            children: column.sortable ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "data-table__sort",
                onClick: () => handleSort(column),
                "aria-label": `Sort by ${column.title}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: column.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-table__sort-indicator", "aria-hidden": "true", children: sortKey === column.key ? sortDirection === "asc" ? "Asc" : "Desc" : "Sort" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-table__heading", children: column.title })
          },
          column.key
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: pagedRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "tr",
          {
            onClick: onRowClick ? () => onRowClick(row) : void 0,
            onKeyDown: (event) => handleRowKeyDown(event, row),
            className: onRowClick ? "is-clickable" : void 0,
            tabIndex: onRowClick ? 0 : void 0,
            children: columns.map((column) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-align": column.align || "left", "data-label": column.title, children: column.render ? column.render(row) : String(getValueByPath(row, column.key) ?? "-") }, column.key))
          },
          resolveRowKey(row)
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-card__footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Showing ",
          pageStart + 1,
          " to ",
          pageEnd,
          " of ",
          sortedRows.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-card__pagination", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "visually-hidden", htmlFor: `${searchId}-page-size`, children: "Items per page" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: `${searchId}-page-size`,
              className: "select",
              value: pageSize,
              onChange: (event) => setPageSize(Number(event.target.value)),
              children: pageSizeOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: option, children: [
                option,
                " per page"
              ] }, option))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "ghost-button",
              onClick: () => setPage((current) => Math.max(1, current - 1)),
              disabled: currentPage === 1,
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            currentPage,
            " / ",
            totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "ghost-button",
              onClick: () => setPage((current) => Math.min(totalPages, current + 1)),
              disabled: currentPage === totalPages,
              children: "Next"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  DataTable as D
};
