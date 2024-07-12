import { faker } from "@faker-js/faker";
import WisbObjectType from "../WisbObjectType";
import { WisbEvent, WisbMessage, WisbUser } from "../interfaces";

export default function getMockupMessages(events: Map<string, WisbEvent>, users: Map<string, WisbUser>): Map<string, WisbMessage[]> {
    //kazdy event, każdy członek

    const map = new Map<string, WisbMessage[]>()
    for (const event of events.values()) {
        const messages: WisbMessage[] = []

        for (const userId of event.members.values()) {
            const user = users.get(userId.id.toString())!

            messages.push({
                event: { type: WisbObjectType.Event, id: event.id },
                content: faker.lorem.paragraph(),
                date: faker.date.recent(),
                sender: { type: WisbObjectType.User, id: user.id, userName: user.userName }
            })
        }

        map.set(event.id.toString(), messages)
    }

    return map
}