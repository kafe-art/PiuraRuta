import React from 'react';
import { Marker } from 'react-native-maps';
import { Business } from '../data/businesses';

interface BusinessMarkerProps {
  business: Business;
  onPress: (business: Business) => void;
}

export default function BusinessMarker({
  business,
  onPress,
}: BusinessMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: business.latitude,
        longitude: business.longitude,
      }}
      title={business.name}
      description={`${business.product} • S/${business.price}`}
      pinColor={business.verified ? '#2E7D32' : '#9E9E9E'}
      onPress={() => onPress(business)}
    />
  );
}