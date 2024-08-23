async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const utils = {
    sleep,
}
