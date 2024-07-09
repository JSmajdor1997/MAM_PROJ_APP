export default function searchString(phrase: string, str: string) {
    return phrase.toLocaleLowerCase().includes(str.toLocaleLowerCase())
}