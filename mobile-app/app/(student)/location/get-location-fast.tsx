import { BlurCard, Text } from "@/godui";
import { useGetLocationStore } from "@/stores/useGetLocationStore";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";

interface Props {
    type?: "standard" | "satellite" | "hybrid";
}

interface LocationData {
    latitude: number;
    longitude: number;
}

interface LocationState {
    region: Region | null;
    address: string | null;
    distanceToSchool: string | null;
    loading: boolean;
    error: string | null;
}

const SCHOOL_LOCATION: LocationData = {
    latitude: 13.348156167011407,
    longitude: 103.84639678264146
};

const DEFAULT_REGION: Region = {
    latitude: SCHOOL_LOCATION.latitude,
    longitude: SCHOOL_LOCATION.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const GetLocation = ({ type = "satellite" }: Props) => {
    const { t } = useTranslation();
    const setGetLocation = useGetLocationStore((state: any) => state.setLocation);

    // Initial state: show school area and loading
    const [locationState, setLocationState] = useState<LocationState>({
        region: DEFAULT_REGION,
        address: null,
        distanceToSchool: null,
        loading: true,
        error: null
    });

    const isMounted = useRef(true);

    // Haversine formula for distance
    const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    const formatDistance = useCallback((distance: number): string => {
        return distance >= 1000
            ? `${(distance / 1000).toFixed(2)} km`
            : `${Math.round(distance)} m`;
    }, []);

    const formatAddress = useCallback((addressComponents: Location.LocationGeocodedAddress): string => {
        const parts = [];
        if (addressComponents.name) parts.push(addressComponents.name);
        if (addressComponents.street) parts.push(addressComponents.street);
        if (addressComponents.city) parts.push(addressComponents.city);
        if (addressComponents.region) parts.push(addressComponents.region);
        if (addressComponents.country) parts.push(addressComponents.country);
        if (parts.length === 0) {
            if (addressComponents.district) parts.push(addressComponents.district);
            if (addressComponents.subregion) parts.push(addressComponents.subregion);
        }
        return parts.slice(0, 3).join(", ") || "Unknown location";
    }, []);

    // Permission only once at the beginning
    const requestLocationPermission = useCallback(async (): Promise<boolean> => {
        try {
            const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
            if (currentStatus === 'granted') return true;
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Location Permission Required",
                    Platform.OS === 'ios'
                        ? 'Please enable location access in Settings > Privacy & Security > Location Services > UNISCAN to get your current location'
                        : 'Please enable location access in Settings > Apps > Permissions > Location > UNISCAN to get your current location',
                    [{ text: "OK" }]
                );
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }, []);

    // Try to get location quickly, fallback after timeout
    const getCurrentLocationFast = useCallback(async (): Promise<LocationData | null> => {
        try {
            // Try high accuracy first, but time out after 2 seconds
            let didTimeout = false;
            const timeout = new Promise<null>(resolve => setTimeout(() => {
                didTimeout = true;
                resolve(null);
            }, 2000));
            const locationPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
                .then(location => ({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }));

            const result = await Promise.race([locationPromise, timeout]);
            if (didTimeout) {
                // Try low accuracy fallback async, but don't block UI
                Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low })
                    .then(location => {
                        if (!isMounted.current) return;
                        setGetLocation(location.coords);
                        setLocationState(prev => ({
                            ...prev,
                            region: {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            },
                            error: null,
                            loading: false,
                        }));
                    }).catch(() => { /* ignore */ });
                return null;
            }
            return result;
        } catch (error) {
            return null;
        }
    }, [setGetLocation]);

    // Get address from coordinates (async, don't block UI)
    const getAddressFromCoordinates = useCallback(async (location: LocationData) => {
        try {
            const addresses = await Location.reverseGeocodeAsync(location);
            if (addresses && addresses.length > 0) {
                if (!isMounted.current) return;
                setLocationState(prev => ({
                    ...prev,
                    address: formatAddress(addresses[0]),
                }));
            }
        } catch (error) {
            if (!isMounted.current) return;
            setLocationState(prev => ({
                ...prev,
                address: "Address not available",
            }));
        }
    }, [formatAddress]);

    // Main initialization
    useEffect(() => {
        isMounted.current = true;
        (async () => {
            setLocationState(prev => ({ ...prev, loading: true, error: null }));

            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                setLocationState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Location permission denied",
                    region: DEFAULT_REGION
                }));
                return;
            }

            // Try to get location quickly, fallback to school area
            const userLocation = await getCurrentLocationFast();
            if (!userLocation) {
                setLocationState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Unable to get current location (slow or denied)",
                    region: DEFAULT_REGION
                }));
                return;
            }

            const region: Region = {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            const distance = calculateDistance(
                userLocation.latitude, userLocation.longitude,
                SCHOOL_LOCATION.latitude, SCHOOL_LOCATION.longitude
            );

            setGetLocation(userLocation);

            setLocationState(prev => ({
                ...prev,
                region,
                distanceToSchool: formatDistance(distance),
                loading: false,
                error: null,
            }));

            getAddressFromCoordinates(userLocation);
        })();

        return () => { isMounted.current = false; };
    }, [
        requestLocationPermission,
        getCurrentLocationFast,
        calculateDistance,
        formatDistance,
        getAddressFromCoordinates,
        setGetLocation
    ]);

    const { region, address, distanceToSchool, loading, error } = locationState;

    // --- UI ---
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region || DEFAULT_REGION}
                mapType={type}
                showsUserLocation={!!region}
                showsMyLocationButton={Platform.OS === 'android'}
                followsUserLocation={false}
                showsCompass={true}
                showsScale={Platform.OS === 'android'}
            >
                {/* Always show school marker */}
                <Marker
                    coordinate={SCHOOL_LOCATION}
                    title="School"
                    description="School Location"
                    pinColor="#EA4335"
                />
                {/* Show user marker and route only if region ≠ school */}
                {region && region.latitude !== SCHOOL_LOCATION.latitude && region.longitude !== SCHOOL_LOCATION.longitude && (
                    <>
                        <Marker
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                            title="Your Location"
                            description={address || "Current location"}
                            pinColor="#4285F4"
                        />
                        <Polyline
                            coordinates={[region, SCHOOL_LOCATION]}
                            strokeColor="#4285F4"
                            strokeWidth={3}
                            lineDashPattern={Platform.OS === 'ios' ? [10, 10] : undefined}
                        />
                    </>
                )}
            </MapView>
            <View className="absolute top-5 left-5 right-5 z-10">
                <BlurCard
                    tint="default"
                    intensity={Platform.OS === 'ios' ? 50 : 30}
                    radius="lg"
                >
                    {loading ? (
                        <View className="flex-row items-center gap-4">
                            <ActivityIndicator
                                size="small"
                                color={Platform.OS === 'ios' ? "#007AFF" : "#2196F3"}
                            />
                            <Text className="text-zinc-900 dark:text-white text-base">
                                {t("gettingLocation")}
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="flex-row items-center gap-4">
                            <Text className="text-danger text-base">
                                {error}
                            </Text>
                        </View>
                    ) : (
                        <View className="gap-2">
                            <Text className="text-zinc-900 dark:text-white text-base" numberOfLines={2}>
                                📍 {address || t("gettingAddress")}
                            </Text>
                            {distanceToSchool && (
                                <Text className="text-zinc-900 dark:text-white text-base">
                                    📏 {t("distanceToSchool")}: {distanceToSchool}
                                </Text>
                            )}
                        </View>
                    )}
                </BlurCard>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: "100%",
        height: "100%",
    },
});

export default GetLocation;