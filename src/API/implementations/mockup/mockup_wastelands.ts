import { faker } from '@faker-js/faker';
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import Wasteland from '../../data_types/Wasteland';
import User from '../../data_types/User';
import getSeededImage from './getSeededImage';

export default function getMockupWastelands(users: User[]): Wasteland[] {
    return faker.helpers.multiple(() => ({
        id: 0,
        place: {
            coords: getRandomLatLngInPoland(),
            asText: faker.location.streetAddress({ useFullAddress: true })
        },
        description: faker.word.words(),
        creationDate: faker.date.recent(),
        reportedBy: faker.helpers.arrayElement(users),
    }), {
        count: 30,
    }).map((it, index) => ({
        ...it,
        photos: faker.helpers.multiple(() => getSeededImage(it.place.asText)),
        afterCleaningData: faker.datatype.boolean() ? {
            cleanedBy: faker.helpers.arrayElements(users),
            date: faker.date.recent(),
            photos: faker.helpers.multiple(() => getSeededImage(it.place.asText))
        } : undefined,
        id: index
    }))
}