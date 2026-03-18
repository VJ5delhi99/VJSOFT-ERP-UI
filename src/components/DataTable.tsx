import { useDeferredValue, useEffect, useId, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react'
import type { DataTableColumn } from '../types'
import EmptyState from './EmptyState'

interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: keyof T | ((row: T) => string)
  title?: string
  description?: string
  loading?: boolean
  searchKeys?: string[]
  searchPlaceholder?: string
  toolbar?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  pageSizeOptions?: number[]
  initialPageSize?: number
  onRowClick?: (row: T) => void
}

function getValueByPath(target: unknown, path: string) {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') {
      return undefined
    }

    return (current as Record<string, unknown>)[key]
  }, target)
}

function compareValues(left: unknown, right: unknown) {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  return String(left ?? '').localeCompare(String(right ?? ''))
}

function resolveAriaSort(sortKey: string | null, sortDirection: 'asc' | 'desc', columnKey: string) {
  if (sortKey !== columnKey) {
    return 'none'
  }

  return sortDirection === 'asc' ? 'ascending' : 'descending'
}

function TableSkeleton({ columnCount, rowCount }: { columnCount: number; rowCount: number }) {
  return (
    <div className="table-skeleton" role="presentation" aria-hidden="true">
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={`skeleton-row-${rowIndex}`}
          className="table-skeleton__row"
          style={{ gridTemplateColumns: `repeat(${Math.max(columnCount, 1)}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columnCount }).map((__, columnIndex) => (
            <span key={`skeleton-cell-${rowIndex}-${columnIndex}`} className="skeleton table-skeleton__cell" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  title,
  description,
  loading = false,
  searchKeys = [],
  searchPlaceholder = 'Search records',
  toolbar,
  emptyTitle = 'No records found',
  emptyDescription = 'Adjust your filters or add a new record to get started.',
  pageSizeOptions = [5, 10, 20],
  initialPageSize = 10,
  onRowClick
}: DataTableProps<T>) {
  const searchId = useId()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const deferredSearch = useDeferredValue(searchTerm)
  const normalizedSearch = deferredSearch.trim().toLowerCase()

  useEffect(() => {
    setPage(1)
  }, [normalizedSearch, data.length, pageSize])

  const filteredRows = useMemo(
    () =>
      searchKeys.length === 0 || normalizedSearch.length === 0
        ? data
        : data.filter((row) =>
            searchKeys.some((key) => String(getValueByPath(row, key) ?? '').toLowerCase().includes(normalizedSearch))
          ),
    [data, normalizedSearch, searchKeys]
  )

  const sortedRows = useMemo(() => {
    if (!sortKey) {
      return filteredRows
    }

    return [...filteredRows].sort((left, right) => {
      const result = compareValues(getValueByPath(left, sortKey), getValueByPath(right, sortKey))
      return sortDirection === 'asc' ? result : result * -1
    })
  }, [filteredRows, sortDirection, sortKey])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pagedRows = useMemo(() => sortedRows.slice(pageStart, pageStart + pageSize), [pageSize, pageStart, sortedRows])
  const pageEnd = sortedRows.length === 0 ? 0 : Math.min(pageStart + pageSize, sortedRows.length)

  function resolveRowKey(row: T) {
    return typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey])
  }

  function handleSort(column: DataTableColumn<T>) {
    if (!column.sortable) {
      return
    }

    if (sortKey === column.key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(column.key)
    setSortDirection('asc')
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T) {
    if (!onRowClick) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRowClick(row)
    }
  }

  const totalLabel = `${sortedRows.length} ${sortedRows.length === 1 ? 'record' : 'records'}`

  return (
    <section className="table-card" aria-busy={loading}>
      {(title || description || searchKeys.length > 0 || toolbar) && (
        <div className="table-card__header">
          <div>
            {title ? <h3>{title}</h3> : null}
            {description ? <p>{description}</p> : null}
          </div>
          <div className="table-card__toolbar">
            <span className="status-chip status-chip--neutral">{totalLabel}</span>
            {searchKeys.length > 0 ? (
              <div className="table-search">
                <label className="visually-hidden" htmlFor={searchId}>
                  {searchPlaceholder}
                </label>
                <input
                  id={searchId}
                  className="input"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={searchPlaceholder}
                />
              </div>
            ) : null}
            {toolbar}
          </div>
        </div>
      )}

      {loading ? (
        <div className="table-scroll">
          <TableSkeleton columnCount={columns.length} rowCount={Math.min(pageSize, 6)} />
        </div>
      ) : pagedRows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} compact />
      ) : (
        <>
          <div className="table-scroll">
            <table className="data-table">
              <caption className="visually-hidden">{title || description || 'Data table'}</caption>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      style={{ width: column.width }}
                      scope="col"
                      aria-sort={resolveAriaSort(sortKey, sortDirection, column.key)}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          className="data-table__sort"
                          onClick={() => handleSort(column)}
                          aria-label={`Sort by ${column.title}`}
                        >
                          <span>{column.title}</span>
                          <span className="data-table__sort-indicator" aria-hidden="true">
                            {sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                          </span>
                        </button>
                      ) : (
                        <span className="data-table__heading">{column.title}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((row) => (
                  <tr
                    key={resolveRowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={(event) => handleRowKeyDown(event, row)}
                    className={onRowClick ? 'is-clickable' : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                  >
                    {columns.map((column) => (
                      <td key={column.key} data-align={column.align || 'left'} data-label={column.title}>
                        {column.render ? column.render(row) : String(getValueByPath(row, column.key) ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-card__footer">
            <span>
              Showing {pageStart + 1}-{pageEnd} of {sortedRows.length}
            </span>
            <div className="table-card__pagination">
              <label className="visually-hidden" htmlFor={`${searchId}-page-size`}>
                Rows per page
              </label>
              <select
                id={`${searchId}-page-size`}
                className="select"
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} / page
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
