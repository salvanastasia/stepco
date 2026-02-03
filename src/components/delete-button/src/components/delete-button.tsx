import { forwardRef, useImperativeHandle } from 'react';
import { Group, ImageSVG, Text } from '@shopify/react-native-skia';
import Touchable from 'react-native-skia-gesture';

import { CloseSvgPath, CloseSvgPathHeight, CloseSvgPathWidth, font, fontStyle } from './constants';
import { useCloseButtonAnimations } from './use-close-buttons-animations';
import { useDeleteButtonAnimations } from './use-delete-button-animations';
import { useGooeyLayer } from './use-gooey-layer';
import { useTextAnimations } from './use-text-animations';

export type DeleteButtonRef = {
  close: () => void;
};

type DeleteButtonProps = {
  onConfirmDeletion: () => void;
  onInitialClick?: () => void;
  onClose?: () => void;
  height: number;
  width: number;
  initialText?: string;
  confirmText?: string;
  additionalWidth: number;
  closeOnConfirm?: boolean;
};

export const DeleteButton = forwardRef<DeleteButtonRef, DeleteButtonProps>(({
  onConfirmDeletion,
  onInitialClick,
  onClose,
  height,
  width,
  additionalWidth,
  initialText = 'START WALKING',
  confirmText = 'WALKING...',
  closeOnConfirm = false,
}, ref) => {
  const { isToggled, deleteButtonRectX, deleteButtonColor, gestureHandler, buttonTransform } =
    useDeleteButtonAnimations({
      additionalWidth,
      onDelete: () => {
        isToggled.value = !closeOnConfirm;
        onConfirmDeletion?.();
      },
      onInitialClick,
    });

  useImperativeHandle(ref, () => ({
    close: () => {
      isToggled.value = false;
      onClose?.();
    },
  }), [isToggled, onClose]);

  const { closeIconCircleX, closeButtonOpacity, gestureHandlerClose, closeButtonTransform, paint } =
    useCloseButtonAnimations({ isToggled, width, additionalWidth, onClose });

  const { deleteTextX, deleteTextOpacity, confirmTextX, confirmTextOpacity } = useTextAnimations({
    isToggled,
    deleteButtonRectX,
    width,
    font,
    initialText,
    confirmText,
  });

  const layer = useGooeyLayer();

  return (
    <Touchable.Canvas
      style={{
        height: height,
        width: width + additionalWidth,
      }}
    >
      <Group layer={layer}>
        <Group origin={{ x: width / 2, y: height / 2 }} transform={buttonTransform}>
          <Touchable.RoundedRect
            {...gestureHandler}
            x={deleteButtonRectX}
            y={0}
            width={width}
            height={height}
            r={20}
            color={deleteButtonColor}
          />
        </Group>
        <Group
          opacity={closeButtonOpacity}
          transform={closeButtonTransform}
          origin={{
            x: width + additionalWidth / 2,
            y: height / 2,
          }}
        >
          <Touchable.Circle
            {...gestureHandlerClose}
            cx={closeIconCircleX}
            cy={height / 2}
            r={height / 2}
            color={deleteButtonColor}
          />
        </Group>
      </Group>
      <Group>
        <Text
          x={deleteTextX}
          y={fontStyle.fontSize / 3 + height / 2}
          text={initialText}
          font={font}
          color={'#1a1a1a'}
          opacity={deleteTextOpacity}
        />
      </Group>
      <Group>
        <Text
          font={font}
          color={'white'}
          x={confirmTextX}
          text={confirmText}
          opacity={confirmTextOpacity}
          y={fontStyle.fontSize / 3 + height / 2}
        />
      </Group>
      <Group
        layer={paint}
        transform={[
          { translateX: -CloseSvgPathWidth / 2 },
          { translateY: -CloseSvgPathHeight / 2 },
        ]}
        origin={{
          x: width + additionalWidth / 2,
          y: height / 2,
        }}
      >
        <ImageSVG svg={CloseSvgPath} x={closeIconCircleX} y={height / 2} />
      </Group>
    </Touchable.Canvas>
  );
});
