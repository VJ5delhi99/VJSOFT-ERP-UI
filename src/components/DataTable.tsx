import { useDeferredValue, useEffect, useState, type ReactNode } from 'react'
import type { DataTableColumn } from '../types'
import EmptyState from './EmptyState'
import Spinner from './Spinner'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const deferredSearch = useDeferredValue(searchTerm)

  useEffect(() => {
    setPage(1)
  }, [deferredSearch, data.length, pageSize])

  const filteredRows =
    searchKeys.length === 0
      ? data
      : data.filter((row) =>
          searchKeys.some((key) => String(getValueByPath(row, key) ?? '').toLowerCase().includes(deferredSearch.toLowerCase()))
        )

  const sortedRows = [...filteredRows].sort((left, right) => {
    if (!sortKey) {
      return 0
    }

    const result = compareValues(getValueByPath(left, sortKey), getValueByPath(right, sortKey))
    return sortDirection === 'asc' ? result : result * -1
  })

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pagedRows = sortedRows.slice(pageStart, pageStart + pageSize)

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

  return (
    <section className="table-card">
      {(title || description || searchKeys.length > 0 || toolbar) && (
        <div className="table-card__header">
          <div>
            {title ? <h3>{title}</h3> : null}
            {description ? <p>{description}</p> : null}
          </div>
          <div className="table-card__toolbar">
            {searchKeys.length > 0 ? (
              <input
                className="input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={searchPlaceholder}
              />
            ) : null}
            {toolbar}
          </div>
        </div>
      )}

      {loading ? (
        <Spinner label="Loading table" />
      ) : pagedRows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} compact />
      ) : (
        <>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      style={{ width: column.width }}
                      className={column.sortable ? 'is-sortable' : undefined}
                      onClick={() => handleSort(column)}
                    >
                      <span>
                        {column.title}
                        {sortKey === column.key ? ` ${sortDirection === 'asc' ? '^' : 'v'}` : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((row) => (
                  <tr
                    key={resolveRowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? 'is-clickable' : undefined}
                  >
                    {columns.map((column) => (
                      <td key={column.key} data-align={column.align || 'left'}>
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
              Showing {pageStart + 1}-{Math.min(pageStart + pageSize, sortedRows.length)} of {sortedRows.length}
            </span>
            <div className="table-card__pagination">
              <select className="select" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} / page
                  </option>
                ))}
              </select>
              <button type="button" className="ghost-button" onClick={() => setPage((current) => Math.max(1, current - 1))}>
                Previous
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
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
