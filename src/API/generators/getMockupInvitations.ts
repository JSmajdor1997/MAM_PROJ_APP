import { faker } from "@faker-js/faker";
import Ref from "../Ref";
import WisbObjectType from "../WisbObjectType";
import { Invitation, WisbEvent, WisbUser } from "../interfaces";

export default function getMockupInvitations(events: Map<string, WisbEvent>, users: Map<string, WisbUser>): Map<string, Invitation[]> {
    return Array.from({ length: users.size * 2 }, () => {
        const user = faker.helpers.arrayElement([...users.values()])

        return {
            user,
            invitations: faker.helpers.multiple(() => {
                const event = faker.helpers.arrayElement([...events.values()])

                return {
                    user: { id: user.id, type: WisbObjectType.User } as Ref<WisbObjectType.User>,
                    event: { id: event.id, name: event.name, type: WisbObjectType.Event } as Ref<WisbObjectType.Event> & { name: string },
                    asAdmin: faker.datatype.boolean({ probability: 0.2 })
                }
            }, { count: { min: 1, max: 5 } })
        } satisfies { user: WisbUser, invitations: Invitation[] }
    }).reduce((map, obj) => map.set(obj.user.id.toString(), obj.invitations), new Map<string, Invitation[]>())
}