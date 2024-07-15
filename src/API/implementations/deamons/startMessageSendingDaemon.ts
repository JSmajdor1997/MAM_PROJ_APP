import { faker } from "@faker-js/faker"
import WisbObjectType from "../../WisbObjectType"
import { WisbMessage } from "../../interfaces"
import getRandomNonCurrentUser from "./getRandomNonCurrentUser"
import Config from "./Config"

export default function startMessageSendingDaemon({storage, interval, broadcastNotifications}: Config) {
    return setInterval(() => {
        const currentUser = storage.get().currentUser
        if (currentUser == null) {
            return
        }

        for (const event of [...storage.get().events.values()]) {
            if ([...event.members.values()].some(it => it.id == currentUser?.id)) {
                const randomUser = getRandomNonCurrentUser(storage, currentUser)

                const messages = storage.get().messages.get(event.id.toString()) ?? []

                const message: WisbMessage = {
                    date: new Date(),
                    content: faker.word.sample(),
                    sender: { type: WisbObjectType.User, id: randomUser.id, userName: randomUser.userName, photoUrl: randomUser.photoUrl },
                    event: { type: WisbObjectType.Event, id: event.id }
                }

                storage.get().messages.set(event.id.toString(), [
                    ...messages,
                    message
                ])

                broadcastNotifications({ message, author: { type: WisbObjectType.User, id: randomUser.id } })

                return
            }
        }
    }, interval)
}