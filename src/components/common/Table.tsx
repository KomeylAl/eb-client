import { Button } from "@/components/ui/button";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cellClassName?: (row: T) => string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

function Table<T>({
  columns = [],
  data = [],
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange = () => {},
}: TableProps<T>) {
  const safePageSize = pageSize || 10;
  const totalPages = Math.ceil(totalItems / safePageSize);

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-md relative">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-white dark:bg-gray-700 text-left border-b dark:border-gray-800">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-3 sm:px-6 py-4 sm:py-6 text-sm font-medium text-gray-700 dark:text-white text-right whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-700">
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-muted-foreground"
              >
                موردی برای نمایش وجود ندارد.
              </td>
            </tr>
          )}
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-3 sm:px-6 py-3 sm:py-4 text-sm text-right ${
                    col.cellClassName
                      ? col.cellClassName(row)
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row as any)[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="w-full flex items-center justify-between px-4 bg-white dark:bg-gray-800 py-6">
          <Button
            variant="outline"
            size="lg"
            disabled={currentPage === 1}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          >
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحه {currentPage} از {totalPages}
          </span>
          <Button
            variant="outline"
            size="lg"
            disabled={currentPage === totalPages}
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}

export default Table;
