import { useSortableTable } from '../../hooks/sortableTable.hooks'
import { IFilesTable } from '../../types'

type FilesTableProps<T extends { [key: string]: unknown }> = {
    files: IFilesTable<T>
    onFileDownload: (row: T) => void
}

export const FilesTable = <T extends { [key: string]: unknown }>({
    files,
    onFileDownload,
}: FilesTableProps<T>) => {
    const { theadRow, tbodyRows } = files

    const { sortedRows, handleSort, getAriaSort, getAriaLabel, sortConfig } =
        useSortableTable({
            rows: tbodyRows,
            columns: theadRow,
        })

    return sortedRows.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No data found</div>
    ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    {theadRow.map((header, index) => (
                        <th
                            key={index}
                            scope="col"
                            className="px-6 py-3"
                            aria-sort={getAriaSort(index)}
                        >
                            <div className="flex items-center">
                                <span>{header.title}</span>
                                {header.sortable && (
                                    <button
                                        onClick={() => handleSort(index)}
                                        className="ml-2 p-1 text-gray-400 hover:text-amber-500 focus:text-amber-500 group"
                                        aria-label={getAriaLabel(
                                            header.title,
                                            index
                                        )}
                                    >
                                        {sortConfig?.key === index ? (
                                            <span className="group-hover:text-amber-500 group-focus:text-amber-500 text-gray-400">
                                                {sortConfig.direction === 'asc'
                                                    ? '▲'
                                                    : '▼'}
                                            </span>
                                        ) : (
                                            <span className="group-hover:text-amber-500 group-focus:text-amber-500 text-gray-400">
                                                ⇅
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedRows.map((row, rowIndex) => (
                    <tr
                        key={`${rowIndex}-${row}`}
                        className={
                            rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }
                    >
                        {theadRow.map((header, cellIndex) =>
                            cellIndex === theadRow.length - 1 ? (
                                <td
                                    key={`${cellIndex}-${header.title}`}
                                    className="px-6 py-4"
                                >
                                    <button
                                        className="inline-block"
                                        onClick={() => onFileDownload(row)}
                                        aria-label="Download"
                                    >
                                        {DownloadSvg}
                                    </button>
                                </td>
                            ) : (
                                <td
                                    key={`${cellIndex}-${header.title}`}
                                    className="px-6 py-4"
                                >
                                    {String(
                                        row[header.accessor as keyof T] ?? ''
                                    )}
                                </td>
                            )
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const DownloadSvg = (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
    >
        <path
            d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H12M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.5 15V21M17.5 21L15 18.5M17.5 21L20 18.5"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)
