import { faker } from '@faker-js/faker';

export default function getRandomDateRangeInRange(dateRange: [Date, Date]): [Date, Date] {
    const from = faker.date.between({ from: dateRange[0], to: dateRange[1] });
    const to = faker.date.between({ from: from, to: dateRange[1] });

    return [from, to]
}