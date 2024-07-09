import { faker } from "@faker-js/faker";
import { Invitation, WisbEvent, WisbUser } from "../interfaces";
import WisbObjectType from "../WisbObjectType";
import Ref from "../Ref";

export default function getMockupInvitations(events: Map<number, WisbEvent>, users: Map<number, WisbUser>): Map<number, Invitation> {
    return Array.from({ length: users.size * 2 }, () => {
        return {
            user: { id: faker.helpers.arrayElement([...users.values()]).id, type: WisbObjectType.User } as Ref<WisbObjectType.User>,
            event: { id: faker.helpers.arrayElement([...events.values()]).id, type: WisbObjectType.Event } as Ref<WisbObjectType.Event>,
            asAdmin: faker.datatype.boolean({ probability: 0.2 })
        }
    }).reduce((map, obj) => map.set(obj.user.id, obj), new Map<number, Invitation>())
}