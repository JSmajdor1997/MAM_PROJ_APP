import { faker } from '@faker-js/faker';
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import getSeededImage from './getSeededImage';
import { WisbUser, WisbWasteland } from '../interfaces';
import WisbObjectType from '../WisbObjectType';
import Ref from '../Ref';

export default function getMockupWastelands(users: Map<number, WisbUser>): Map<number, WisbWasteland> {
    const usersList = [...users.values()]

    return faker.helpers.multiple(() => ({
        id: 0,
        place: {
            coords: getRandomLatLngInPoland(),
            asText: faker.location.streetAddress({ useFullAddress: true })
        },
        description: faker.word.words(),
        creationDate: faker.date.recent(),
        reportedBy: { type: WisbObjectType.User, id: faker.helpers.arrayElement(usersList).id } as Ref<WisbObjectType.User>,
    }), {
        count: 30,
    }).map((it, index) => ({
        ...it,
        photos: faker.helpers.multiple(() => getSeededImage(it.place.asText)),
        afterCleaningData: faker.datatype.boolean() ? {
            cleanedBy: faker.helpers.arrayElements(usersList).map(it => ({ type: WisbObjectType.User, id: it.id })),
            date: faker.date.recent(),
            photos: faker.helpers.multiple(() => getSeededImage(it.place.asText))
        } : undefined,
        id: index
    } satisfies WisbWasteland)).reduce((map, obj) => map.set(obj.id, obj), new Map<number, WisbWasteland>())
}