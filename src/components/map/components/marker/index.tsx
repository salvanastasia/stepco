import React, { memo } from 'react';
import { Avatar } from '@/components/ui';
import { Pressable } from 'react-native';
import { Icon } from '@/components/icons';
import { slate } from 'tailwindcss/colors';
import { MarkerView } from '@maplibre/maplibre-react-native';
import { Link } from 'expo-router';

type Props = {
  avatarUrl?: string;
  coordinates: [number, number];
};

const Marker = ({ coordinates, avatarUrl }: Props) => {
  return (
    <MarkerView anchor={{ x: 0.5, y: 0.5 }} coordinate={coordinates}>
      <Link
        asChild
        href={{
          pathname: '/map/[latitude]/[longitude]',
          params: { longitude: coordinates[0].toString(), latitude: coordinates[1].toString() },
        }}
      >
        <Pressable>
          <Avatar pointerEvents="none" alt={'Name not set'} size="sm" variant="soft">
            <Avatar.Fallback className="bg-slate-950">
              <Icon name="gallery" size={18} color={slate[500]} set="bold" />
            </Avatar.Fallback>
            <Avatar.Image source={{ uri: avatarUrl }} />
          </Avatar>
        </Pressable>
      </Link>
    </MarkerView>
  );
};

export default memo(Marker);
