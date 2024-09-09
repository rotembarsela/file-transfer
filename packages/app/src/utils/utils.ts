async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const dates = {
    formatDate: (dateString: string) => {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0] // Returns the date in YYYY-MM-DD format
    },
}

export const utils = {
    sleep,
    dates,
}
