import { faker } from "@faker-js/faker";
import Ref from "../Ref";
import WisbObjectType from "../WisbObjectType";
import { Message, WisbEvent, WisbUser } from "../interfaces";

export default function getMockupMessages(events: Map<string, WisbEvent>, users: Map<string, WisbUser>): Map<string, Message[]> {
    return Array.from(events.keys()).map(id => ({
        messages: Array.from({ length: faker.number.int({ min: 1, max: 20 }) }, () => ({
            event: { type: WisbObjectType.Event, id: parseInt(id) } as Ref<WisbObjectType.Event>,
            content: faker.word.sample(),
            date: faker.date.recent(),
            sender: { type: WisbObjectType.User, id: faker.helpers.arrayElement([...events.get(id)!.members.values()]).id }
        } satisfies Message)),
        id
    })).reduce((map, { id, messages }) => map.set(id, messages), new Map<string, Message[]>())
}