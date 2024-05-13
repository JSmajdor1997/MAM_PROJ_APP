import { faker } from '@faker-js/faker';
import getRandomLatLngInPoland from './getRandomLatLngInPoland';
import Wasteland from '../../data_types/Wasteland';
import User from '../../data_types/User';

export default function getMockupWastelands(users: User[]): Wasteland[] {
    return faker.helpers.multiple(() => ({
        id: 0,
        placeCoords: getRandomLatLngInPoland(),
        placeDescription: faker.location.streetAddress({ useFullAddress: true }),
        photos: faker.helpers.multiple(() => faker.image.urlLoremFlickr({ category: "nature" })),
        description: faker.word.words(),
        creationDate: faker.date.recent(),
        reportedBy: faker.helpers.arrayElement(users),
        afterCleaningData: faker.datatype.boolean() ? {
            cleanedBy: faker.helpers.arrayElements(users),
            date: faker.date.recent(),
            photos: faker.helpers.multiple(() => faker.image.urlLoremFlickr({ category: "nature" }))
        } : undefined
    }), {
        count: 30,
    }).map((it, index) => ({
        ...it,
        id: index
    }))
}