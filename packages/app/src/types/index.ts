export interface IFile {
    id: number
    fileName: string
    uploadTime: string
    expiryTime: string
}

export interface IFile extends Record<string, unknown> {}

export interface IFilesTable<T> {
    theadRow: { title: string; sortable: boolean; accessor: keyof T }[]
    tbodyRows: T[]
}

export type Variant = 'info' | 'success' | 'danger' | 'warning'

export type Size = 'sm' | 'md' | 'lg' | 'xl'

export interface IUser {
    firstName: string
    surname: string
}
