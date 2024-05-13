export default interface User {
    id: number
    email: string
    userName: string
    password: string
    photoUrl?: string
    nrOfClearedWastelands: number
    addedDumpsters: number
    deletedDumpsters: number
}