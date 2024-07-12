import { faker } from '@faker-js/faker';
import { WisbUser } from '../interfaces';
import getSeededImage from './getSeededImage';

export default function getMockupUsers(): Map<string, WisbUser> {
    return faker.helpers.multiple(() => ({
        id: 0,
        email: faker.internet.email(),
        userName: faker.internet.userName(),
        password: "123",
        nrOfClearedWastelands: faker.number.int({ min: 0, max: 120 }),
        addedDumpsters: faker.number.int({ min: 0, max: 120 }),
        deletedDumpsters: faker.number.int({ min: 0, max: 120 })
    }), {
        count: 30,
    }).map((it, index) => ({
        ...it,
        photoUrl: faker.datatype.boolean() ? getSeededImage(it.email) : undefined,
        id: index
    } satisfies WisbUser)).reduce((map, obj) => map.set(obj.id.toString(), obj), new Map<string, WisbUser>())
}