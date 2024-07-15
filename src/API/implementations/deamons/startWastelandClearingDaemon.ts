import { faker } from "@faker-js/faker"
import WisbObjectType from "../../WisbObjectType"
import getSeededImage from "../../generators/getSeededImage"
import { WisbWasteland } from "../../interfaces"
import { CRUD } from "../../notifications"
import getRandomNonCurrentUser from "./getRandomNonCurrentUser"
import Config from "./Config"

export default function startWastelandClearingDaemon({storage, interval, broadcastNotifications}: Config) {
    return setInterval(() => {
        const currentUser = storage.get().currentUser

        if (currentUser == null) {
            return
        }

        const randomUser = getRandomNonCurrentUser(storage, currentUser)

        const wastelands = [...storage.get().wastelands.values()]
        const index = faker.number.int({ min: 0, max: wastelands.length - 1 })

        // readonly cleanedBy: Ref<WisbObjectType.User>[]
        // readonly date: Date
        // readonly photos: string[]

        const afterCleaningData = {
            cleanedBy: [{ type: WisbObjectType.User, id: randomUser.id }],
            date: new Date(),
            photos: faker.helpers.multiple(() => getSeededImage("seed"), { count: 2 })
        }

        const wasteland = {
            ...wastelands[index],
            afterCleaningData
        } as WisbWasteland

        storage.get().wastelands.set(wasteland.id.toString(), wasteland)

        broadcastNotifications({
            author: { type: WisbObjectType.User, id: randomUser.id },
            ref: { type: WisbObjectType.Wasteland, id: wasteland.id },
            action: CRUD.Updated,
            updatedFields: { "afterCleaningData": afterCleaningData } as any
        })
    }, interval)
}