const API_BASE_URL = 'http://localhost:8080/api'

export async function APIFetcher<T, K = undefined>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: K | FormData
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    return fetcher<T, K>(url, method, body)
}

async function fetcher<T, K = undefined>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: K | FormData
): Promise<T> {
    const options: RequestInit = {
        method,
        headers:
            body instanceof FormData
                ? {}
                : { 'Content-Type': 'application/json' },
        body: body instanceof FormData ? body : JSON.stringify(body),
    }

    const response = await fetch(url, options)

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
    }

    const contentType = response.headers.get('Content-Type')

    let data: T

    if (contentType?.includes('application/json')) {
        data = await response.json()
    } else if (
        contentType?.includes('application/octet-stream') ||
        contentType?.includes(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) ||
        contentType?.includes('application/pdf')
    ) {
        data = (await response.blob()) as unknown as T
    } else if (contentType?.includes('text/plain')) {
        data = (await response.text()) as unknown as T
    } else {
        throw new Error(`Unsupported response type: ${contentType}`)
    }

    return data
}
