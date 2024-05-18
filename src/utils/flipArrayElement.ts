export default function flipArrayElement<T>(array: T[], element: T) {
    const index = array.indexOf(element)

    if (index == -1) {
        return [...array, element]
    }

    return [
        ...array.slice(0, index),
        ...array.slice(index + 1),
    ]
}