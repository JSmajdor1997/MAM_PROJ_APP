import { faker } from '@faker-js/faker';
import Dumpster from "../../data_types/Dumpster";
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import User from '../../data_types/User';

export default function getMockupDumpsters(users: User[]): Dumpster[] {
    return faker.helpers.multiple(() => ({
        id: 0,
        addedBy: faker.helpers.arrayElement(users),
        place: {
            coords: getRandomLatLngInPoland(),
            asText: faker.location.streetAddress({ useFullAddress: true })
        },
        description: faker.word.words(),
        photos: faker.helpers.multiple(() => faker.image.urlLoremFlickr({ category: "nature" }))
    }), {
        count: 30,
    }).map((it, index) => ({
        ...it,
        id: index
    }))
}