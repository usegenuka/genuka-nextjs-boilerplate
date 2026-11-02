import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";
import { Link } from "@/lib/navigation";

export interface Column<Row> {
  key: string;
  header: React.ReactNode;
  cell: (row: Row) => React.ReactNode;
  align?: "left" | "right";
  /** Hidden below md, when there is no mobile card (secondary columns). */
  hideOnMobile?: boolean;
  /** The header becomes a sort link (needs the table's `sort`). */
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<Row> {
  rows: Row[];
  columns: Column<Row>[];
  rowKey: (row: Row) => string;
  /** One card per row below md, as in the dashboard (customers list). Without it the table scrolls sideways. */
  mobileCard?: (row: Row) => React.ReactNode;
  /** Above the rows: search on the left, filters and actions on the right. */
  toolbar?: React.ReactNode;
  /** Shown instead of the rows when there are none (an EmptyState). */
  empty?: React.ReactNode;
  /** Under the rows: a Pagination. */
  footer?: React.ReactNode;
  /** Current sort, kept in the URL: the dashboard sorts on the server (`?sort=-created_at`). */
  sort?: { key: string; direction: "asc" | "desc"; hrefFor: (key: string, direction: "asc" | "desc") => string };
  className?: string;
}

// The dashboard's table look, without its server logic: white card, slate-50 header,
// dashed row separators, slate-50 hover. Fetch, sort and paginate on the server and pass the rows.
function DataTable<Row>({ rows, columns, rowKey, mobileCard, toolbar, empty, footer, sort, className }: DataTableProps<Row>) {
  return (
    <div className={cn("w-full overflow-hidden rounded-lg bg-white shadow-md shadow-slate-100 ring-1 ring-slate-200/60", className)}>
      {toolbar && (
        <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:p-5">
          {toolbar}
        </div>
      )}

      {rows.length === 0 ? (
        empty
      ) : (
        <>
          <div className={cn("overflow-x-auto", mobileCard && "hidden md:block")}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={sort?.key === column.key ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}
                      className={cn(
                        "whitespace-nowrap bg-slate-50 px-5 py-2 font-medium text-slate-500",
                        column.align === "right" && "text-right",
                        column.hideOnMobile && "hidden md:table-cell",
                        column.className,
                      )}
                    >
                      {column.sortable && sort ? <SortLink column={column} sort={sort} /> : column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={rowKey(row)} className="transition-colors hover:bg-slate-50">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "border-b border-dashed border-slate-200 px-5 py-4 text-slate-600",
                          column.align === "right" && "text-right tabular-nums",
                          column.hideOnMobile && "hidden md:table-cell",
                          column.className,
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mobileCard && (
            <ul className="flex flex-col gap-3 p-4 md:hidden">
              {rows.map((row) => (
                <li key={rowKey(row)} className="flex flex-col gap-2 rounded-md border border-slate-100 p-3 shadow-sm">
                  {mobileCard(row)}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {footer && <div className="p-4 md:p-5">{footer}</div>}
    </div>
  );
}

function SortLink<Row>({ column, sort }: { column: Column<Row>; sort: NonNullable<DataTableProps<Row>["sort"]> }) {
  const active = sort.key === column.key;
  const next = active && sort.direction === "asc" ? "desc" : "asc";
  return (
    <Link
      href={sort.hrefFor(column.key, next)}
      className={cn("-mx-2 inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-200/60", column.align === "right" && "flex-row-reverse")}
    >
      {column.header}
      <span aria-hidden className="flex flex-col [&_svg]:size-3">
        <ChevronUp className={cn("-mb-1", active && sort.direction === "asc" ? "text-slate-900" : "text-slate-400")} />
        <ChevronDown className={active && sort.direction === "desc" ? "text-slate-900" : "text-slate-400"} />
      </span>
    </Link>
  );
}

export { DataTable };
