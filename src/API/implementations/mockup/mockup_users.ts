import { faker } from '@faker-js/faker';
import User from '../../data_types/User';
import getSeededImage from './getSeededImage';

export default function getMockupUsers(): User[] {
    return faker.helpers.multiple(() => ({
        id: 0,
        email: faker.internet.email(),
        userName: faker.internet.userName(),
        password: "123",
        nrOfClearedWastelands: faker.number.int({ min: 0 }),
        addedDumpsters: faker.number.int({ min: 0 }),
        deletedDumpsters: faker.number.int({ min: 0 })
    }), {
        count: 30,
    }).map((it, index) => ({
        ...it,
        photoUrl: faker.datatype.boolean() ? getSeededImage(it.email) : undefined,
        id: index
    }))
}