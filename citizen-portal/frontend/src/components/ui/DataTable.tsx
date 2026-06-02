import * as React from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = "No matching records found in database registries.",
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    const sorted = [...data];
    return sorted.sort((a: any, b: any) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      // Handle simple nested values or fallback
      if (typeof valA === "object") valA = JSON.stringify(valA);
      if (typeof valB === "object") valB = JSON.stringify(valB);

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
  }, [data, sortKey, sortDirection]);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
            {columns.map((col, index) => (
              <th
                key={index}
                onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                className={`
                  p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400
                  ${col.sortable ? "cursor-pointer select-none hover:text-blue-900 dark:hover:text-blue-400 transition" : ""}
                `}
              >
                <div className="flex items-center gap-1.5">
                  <span>{col.header}</span>
                  {col.sortable && (
                    <span className="text-gray-400 shrink-0">
                      {sortKey === col.accessorKey ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-3.5 h-3.5 text-blue-900 dark:text-blue-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-blue-900 dark:text-blue-400" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center justify-center py-4">
                  <span className="text-lg font-medium tracking-tight mb-1 text-gray-400">Registry Empty</span>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                className={`
                  transition-colors group
                  ${onRowClick ? "cursor-pointer hover:bg-slate-50/75 dark:hover:bg-indigo-950/15" : "hover:bg-slate-50/40 dark:hover:bg-indigo-950/5"}
                `}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 text-sm font-medium text-gray-800 dark:text-slate-300">
                    {col.cell ? col.cell(item) : (item as any)[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
