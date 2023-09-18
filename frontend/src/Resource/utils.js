export const formatPollingInterval = (value) => {
    if (value === 1) {
        return `1 min`
    }
    return `${value} mins`
}
