import { IFilesTable } from '../../types'

type FilesTableProps = {
    files: IFilesTable
}

export const FilesTable = ({ files }: FilesTableProps) => {
    const { theadRow, tbodyRows } = files

    return tbodyRows.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No data found</div>
    ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    {theadRow.map((header, index) => (
                        <th key={index} scope="col" className="px-6 py-3">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tbodyRows.map((row, rowIndex) => (
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
