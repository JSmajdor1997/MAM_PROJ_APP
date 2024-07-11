import { faker } from '@faker-js/faker';
import getRandomDateRangeInRange from './getRandomDateRange';
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import getSeededImage from './getSeededImage';
import { Message, WisbEvent, WisbUser, WisbWasteland } from '../interfaces';
import WisbObjectType from '../WisbObjectType';
import Ref from '../Ref';

function getYearDateRange(): [Date, Date] {
    const nextYearDate = new Date()
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1)

    return [new Date(), nextYearDate]
}

export default function getMockupEvents(users: Map<string, WisbUser>, wastelands: Map<string, WisbWasteland>, count: number = 30): Map<string, WisbEvent> {
    const usersList = [...users.values()]

    return faker.helpers.multiple(() => {
        const dateRange = getRandomDateRangeInRange(getYearDateRange())

        const admins = faker.helpers.arrayElements(usersList, { min: 1, max: usersList.length > 1 ? usersList.length / 2 : 1 })
        const name = faker.word.words()

        return {
            id: 0,
            name,
            iconUrl: getSeededImage(name),
            dateRange,
            place: {
                asText: faker.location.streetAddress(),
                coords: getRandomLatLngInPoland()
            },
            description: faker.word.words(),
            wastelands: faker.helpers.arrayElements([...wastelands.values()]).map(({id}) => ({type: WisbObjectType.Wasteland, id})),
            members: [
                ...faker.helpers.arrayElements(usersList, {min: 10, max: usersList.length}).filter(member => !admins.some(admin => admin.id == member.id)).map(it => ({ id: it.id, type: WisbObjectType.User, isAdmin: false } as Ref<WisbObjectType.User> & { isAdmin: boolean })),
                ...admins.map(it => ({ id: it.id, type: WisbObjectType.User, isAdmin: true } as Ref<WisbObjectType.User> & { isAdmin: boolean }))
            ].reduce((map, obj) => map.set(obj.id, obj), new Map())
        } satisfies WisbEvent
    }, {
        count,
    }).map((it, index) => ({
        ...it,
        id: index
    } satisfies WisbEvent)).reduce((map, obj) => map.set(obj.id.toString(), obj), new Map<string, WisbEvent>())
}