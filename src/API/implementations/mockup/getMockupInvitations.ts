import { Invitation } from "../../data_types/Invitation";
import User from "../../data_types/User";
import Event, { EventUser } from "../../data_types/Event";
import { faker } from "@faker-js/faker";

export default function getMockupInvitations(events: { event: Event, members: EventUser[], admins: EventUser[] }[], users: User[]): Invitation[] {
    return Array.from({ length: users.length * 2 }, () => {
        return {
            user: faker.helpers.arrayElement(users),
            event: faker.helpers.arrayElement(events).event
        }
    })
}