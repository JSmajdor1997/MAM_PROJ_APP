import React, { createContext, ReactNode } from 'react';
import { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';
import Geolocation from '@react-native-community/geolocation';
import { LatLng } from 'react-native-maps';

interface LocationContextType {
    location: LatLng | null;
    error: GeolocationError | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
    children: ReactNode;
    onLocationChanged?: (newLocation: LatLng) => void
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children, onLocationChanged }) => {
    const [location, setLocation] = React.useState<LatLng | null>(null);
    const [error, setError] = React.useState<GeolocationError | null>(null);

    React.useEffect(() => {
        const watchId = Geolocation.watchPosition(
            (position: GeolocationResponse) => {
                setLocation(position.coords);
                onLocationChanged?.(position.coords)
                setError(null);
            },
            (error: GeolocationError) => {
                setError(error);
            },
            { enableHighAccuracy: true, distanceFilter: 0, interval: 10000, fastestInterval: 5000 }
        );

        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <LocationContext.Provider value={{ location, error }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = (listener?: (location: LatLng) => void) => {
    const context = React.useContext(LocationContext);
    const listenerRef = React.useRef(listener);

    const cleanup = () => {
        listenerRef.current = undefined;
    };

    if (context != undefined) {
        React.useEffect(() => {
            listenerRef.current = listener;
        }, [listener]);

        React.useEffect(() => {
            if (listenerRef.current && context.location) {
                listenerRef.current(context.location);
            }
        }, [context.location]);
    }

    return cleanup;
};