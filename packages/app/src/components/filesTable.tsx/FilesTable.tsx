import { useSortableTable } from '../../hooks/sortableTable.hooks'
import { IFilesTable } from '../../types'

type FilesTableProps = {
    files: IFilesTable
}

export const FilesTable = ({ files }: FilesTableProps) => {
    const { theadRow, tbodyRows } = files

    const { sortedRows, handleSort, getAriaSort, getAriaLabel, sortConfig } =
        useSortableTable({
            rows: tbodyRows,
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
                                <span>{header}</span>
                                <button
                                    onClick={() => handleSort(index)}
                                    className="ml-2 p-1 text-gray-400 hover:text-amber-500 group"
                                    aria-label={getAriaLabel(header, index)}
                                >
                                    {sortConfig?.key === index ? (
                                        <span className="group-hover:text-amber-500 text-gray-400">
                                            {sortConfig.direction === 'asc'
                                                ? '▲'
                                                : '▼'}
                                        </span>
                                    ) : (
                                        <span className="group-hover:text-amber-500 text-gray-400">
                                            ⇅
                                        </span>
                                    )}
                                </button>
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedRows.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className={
                            rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }
                    >
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
