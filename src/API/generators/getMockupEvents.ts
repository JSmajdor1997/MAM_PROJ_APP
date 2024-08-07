import { faker } from '@faker-js/faker';
import Ref from '../Ref';
import WisbObjectType from '../WisbObjectType';
import { WisbEvent, WisbUser, WisbWasteland } from '../interfaces';
import getRandomDateRangeInRange from './getRandomDateRange';
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import getSeededImage from './getSeededImage';

function getDateRange(): [Date, Date] {
    const previousYearDate = new Date()
    previousYearDate.setMonth(previousYearDate.getMonth() - 1)

    const nextYearDate = new Date()
    nextYearDate.setMonth(nextYearDate.getMonth() + 1)

    return [previousYearDate, nextYearDate]
}

export default function getMockupEvents(users: Map<string, WisbUser>, wastelands: Map<string, WisbWasteland>, count: number = 30): Map<string, WisbEvent> {
    const usersList = [...users.values()]

    return faker.helpers.multiple(() => {
        const dateRange = getRandomDateRangeInRange(getDateRange())

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
            wastelands: faker.helpers.arrayElements([...wastelands.values()]).map(({ id }) => ({ type: WisbObjectType.Wasteland, id })),
            members: [
                ...faker.helpers.arrayElements(usersList, { min: 10, max: usersList.length }).filter(member => !admins.some(admin => admin.id == member.id)).map(it => ({ id: it.id, type: WisbObjectType.User, isAdmin: false } as Ref<WisbObjectType.User> & { isAdmin: boolean })),
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