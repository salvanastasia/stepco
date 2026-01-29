import { Platform } from 'react-native';

import { matchFont, Skia } from '@shopify/react-native-skia';

export const CloseSvgPath = Skia.SVG.MakeFromString(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><rect x="4" y="4" width="16" height="16" rx="2" fill="white"/></svg>'
);

export const CloseSvgPathWidth = CloseSvgPath?.width() ?? 0;
export const CloseSvgPathHeight = CloseSvgPath?.height() ?? 0;

export const fontFamily = Platform.select({
  ios: 'Helvetica',
  default: 'serif',
});

export const fontStyle = {
  fontFamily,
  fontSize: 14,
  fontWeight: 'bold',
} as const;
export const font = matchFont(fontStyle);
