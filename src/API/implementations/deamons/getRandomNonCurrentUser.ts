import { faker } from "@faker-js/faker"
import { WisbUser } from "../../interfaces"
import Storage from "../Storage"

export default function getRandomNonCurrentUser(storage: Storage, currentUser: WisbUser) {
    const usersList = [...storage.get().users.values()]

    let randomUser: WisbUser

    do {
        randomUser = usersList[faker.number.int({ min: 0, max: usersList.length - 1 })]
    } while (randomUser.id == currentUser.id)

    return randomUser
}