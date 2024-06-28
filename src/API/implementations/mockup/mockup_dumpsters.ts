import { faker } from '@faker-js/faker';
import Dumpster from "../../data_types/Dumpster";
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import User from '../../data_types/User';
import getSeededImage from './getSeededImage';

export default function getMockupDumpsters(users: User[]): Dumpster[] {
    return faker.helpers.multiple(() => ({
        id: 0,
        addedBy: faker.helpers.arrayElement(users),
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
    }))
}