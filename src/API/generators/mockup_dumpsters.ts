import { faker } from '@faker-js/faker';
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import getSeededImage from './getSeededImage';
import { WisbDumpster, WisbUser } from '../interfaces';
import WisbObjectType from '../WisbObjectType';
import Ref from '../Ref';

export default function getMockupDumpsters(users: Map<number, WisbUser>): Map<number, WisbDumpster> {
    const usersList = [...users.values()]

    return faker.helpers.multiple(() => ({
        id: 0,
        addedBy: { id: faker.helpers.arrayElement(usersList).id, type: WisbObjectType.User } as Ref<WisbObjectType.User>,
        place: {
            coords: getRandomLatLngInPoland(),
            asText: faker.location.streetAddress({ useFullAddress: true })
        },
        description: faker.word.words(),
    }), {
        count: 30,
    }).map((it, index) => ({
        ...it,
        photos: faker.helpers.multiple(() => getSeededImage(it.id.toString())),
        id: index
    } satisfies WisbDumpster)).reduce((map, obj) => map.set(obj.id, obj), new Map<number, WisbDumpster>())
}