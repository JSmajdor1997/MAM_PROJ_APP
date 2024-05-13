import { faker } from '@faker-js/faker';
import { LatLng } from "react-native-maps"

export default function getRandomLatLngInPoland(): LatLng {
  // Define the approximate bounding box for Poland
  const latMin = 49.0;
  const latMax = 54.8;
  const lngMin = 14.1;
  const lngMax = 24.1;

  // Generate random latitude and longitude within the bounding box
  const latitude = faker.location.latitude({ min: latMin, max: latMax });
  const longitude = faker.location.longitude({ min: lngMin, max: lngMax });

  return { latitude, longitude };
}