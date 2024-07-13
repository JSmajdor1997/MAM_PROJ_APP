import { faker } from "@faker-js/faker"
import { LatLng } from "react-native-maps"
import WisbObjectType from "../../WisbObjectType"
import getMockupDumpsters from "../../generators/getMockupDumpsters"
import getMockupEvents from "../../generators/getMockupEvents"
import getMockupWastelands from "../../generators/getMockupWastelands"
import { CRUD } from "../../notifications"
import getRandomNonCurrentUser from "./getRandomNonCurrentUser"
import Config from "./Config"

export default function startCRUDDaemon({storage, interval, broadcastNotifications}: Config) {
    setInterval(() => {
        const currentUser = storage.get().currentUser
        if (currentUser == null) {
            return
        }

        const randomUser = getRandomNonCurrentUser(storage, currentUser)

        let type: WisbObjectType
        let location: LatLng

        if (faker.datatype.boolean()) {
            const randomWasteland = {
                ...[...getMockupWastelands(storage.get().users, 1).values()][0],
                id: Math.max(...[...storage.get().wastelands.values()].map(it => it.id)) + 1,
            }

            type = WisbObjectType.Wasteland
            location = randomWasteland.place.coords

            storage.get().wastelands.set(randomWasteland.id.toString(), randomWasteland)

        } else if (faker.datatype.boolean()) {
            const randomDumpster = {
                ...[...getMockupDumpsters(storage.get().users, 1).values()][0],
                id: Math.max(...[...storage.get().dumpsters.values()].map(it => it.id)) + 1,
            }

            type = WisbObjectType.Dumpster
            location = randomDumpster.place.coords

            storage.get().dumpsters.set(randomDumpster.id.toString(), randomDumpster)
        } else {
            const randomEvent = {
                ...[...getMockupEvents(storage.get().users, storage.get().wastelands, 1).values()][0],
                id: Math.max(...[...storage.get().events.values()].map(it => it.id)) + 1,
            }

            type = WisbObjectType.Event
            location = randomEvent.place.coords

            storage.get().events.set(randomEvent.id.toString(), randomEvent)
        }

        broadcastNotifications({
            author: { type: WisbObjectType.User, id: randomUser.id },
            type,
            action: CRUD.Created,
            location
        })
    }, interval)
}