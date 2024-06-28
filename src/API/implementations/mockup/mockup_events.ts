import { faker } from '@faker-js/faker';
import Event, { EventUser } from '../../data_types/Event';
import getRandomDateRangeInRange from './getRandomDateRange';
import User from '../../data_types/User';
import Wasteland from '../../data_types/Wasteland';
import Message from '../../data_types/Message';
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import getSeededImage from './getSeededImage';

function getYearDateRange(): [Date, Date] {
    const nextYearDate = new Date()
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1)

    return [new Date(), nextYearDate]
}

export default function getMockupEvents(users: User[], wastelands: Wasteland[]): { event: Event, members: EventUser[], admins: EventUser[] }[] {
    return faker.helpers.multiple(() => {
        const dateRange = getRandomDateRangeInRange(getYearDateRange())

        const admins = faker.helpers.arrayElements(users, { min: 1, max: users.length > 1 ? users.length / 2 : 1 })
        const members = [
            ...faker.helpers.arrayElements(users).filter(member => !admins.some(admin => admin.id == member.id)),
            ...admins
        ]

        const messages: Message[] = faker.helpers.multiple(() => ({
            sender: faker.helpers.arrayElement(users),
            content: faker.word.words(),
            date: faker.date.recent()
        })).map(it => ({...it, photosUrls: faker.helpers.multiple(() => getSeededImage(dateRange[0].toDateString()))}))

        return {
            event: {
                id: 0,
                name: faker.word.words(),
                iconUrl:  getSeededImage(dateRange[0].toDateString()),
                dateRange,
                meetPlace: {
                    asText: faker.location.streetAddress(),
                    coords: getRandomLatLngInPoland()
                },
                description: faker.word.words(),
                messages,
                wastelands: faker.helpers.arrayElements(wastelands),
            },
            admins,
            members,
        }
    }, {
        count: 30,
    }).map((it, index) => ({
        ...it,
        event: {
            ...it.event,
            id: index
        }
    }))
}