import { faker } from '@faker-js/faker';
import Ref from '../Ref';
import WisbObjectType from '../WisbObjectType';
import { WisbUser, WisbWasteland } from '../interfaces';
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import getSeededImage from './getSeededImage';

export default function getMockupWastelands(users: Map<string, WisbUser>, count: number = 30): Map<string, WisbWasteland> {
    const usersList = [...users.values()]

    return faker.helpers.multiple(() => {
        const user = faker.helpers.arrayElement(usersList)

        return {
            id: 0,
            place: {
                coords: getRandomLatLngInPoland(),
                asText: faker.location.streetAddress({ useFullAddress: true })
            },
            description: faker.word.words(),
            creationDate: faker.date.recent(),
            reportedBy: { type: WisbObjectType.User, id: user.id, userName: user.userName } as Ref<WisbObjectType.User> & { userName: string },
        }
    }, {
        count,
    }).map((it, index) => ({
        ...it,
        photos: faker.helpers.multiple(() => getSeededImage(it.place.asText)),
        afterCleaningData: faker.datatype.boolean() ? {
            cleanedBy: faker.helpers.arrayElements(usersList).map(it => ({ type: WisbObjectType.User, id: it.id })),
            date: faker.date.recent(),
            photos: faker.helpers.multiple(() => getSeededImage(it.place.asText))
        } : undefined,
        id: index
    } satisfies WisbWasteland)).reduce((map, obj) => map.set(obj.id.toString(), obj), new Map<string, WisbWasteland>())
}