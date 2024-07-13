import { faker } from "@faker-js/faker"
import WisbObjectType from "../../WisbObjectType"
import { Invitation } from "../../interfaces"
import getRandomNonCurrentUser from "./getRandomNonCurrentUser"
import Config from "./Config"

export default function startInvitationSendingDaemon({storage, interval, broadcastNotifications}: Config) {
    setInterval(() => {
        const currentUser = storage.get().currentUser
        if (currentUser == null) {
            return
        }

        for (const event of [...storage.get().events.values()]) {
            if (![...event.members.values()].some(it => it.id == currentUser?.id)) {
                const randomUser = getRandomNonCurrentUser(storage, currentUser)

                const invitations = storage.get().invitations.get(event.id.toString()) ?? []
                const invitation = {
                    event: { type: WisbObjectType.Event, id: event.id, name: event.name },
                    user: { type: WisbObjectType.User, id: currentUser.id },
                    asAdmin: faker.datatype.boolean({ probability: 0.2 })
                } as Invitation

                storage.get().invitations.set(event.id.toString(), [
                    ...invitations,
                    invitation
                ])

                broadcastNotifications({ invitation, author: { type: WisbObjectType.User, id: randomUser.id } })

                return
            }
        }
    }, interval)
}