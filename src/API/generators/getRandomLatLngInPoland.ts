import { faker } from '@faker-js/faker';
import { LatLng } from "react-native-maps";

export default function getRandomLatLngInPoland(): LatLng {
  const latMin = 50.2439;
  const latMax = 50.3546;
  const lngMin = 18.5813;
  const lngMax = 18.8095;

  const latitude = faker.location.latitude({ min: latMin, max: latMax });
  const longitude = faker.location.longitude({ min: lngMin, max: lngMax });

  return { latitude, longitude };
}