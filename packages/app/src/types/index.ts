export interface IFile {
    title: string
}

export interface IFilesTable {
    theadRow: string[]
    tbodyRows: string[][]
}

export type Variant = 'info' | 'success' | 'danger' | 'warning'

export type Size = 'sm' | 'md' | 'lg' | 'xl'
