import { forwardRef } from 'react';
import { DeleteButton, DeleteButtonRef } from './components/delete-button';

type Props = {
  onClose?: () => void;
  onInitialClick?: () => void;
};

const App = forwardRef<DeleteButtonRef, Props>(({ onClose, onInitialClick }, ref) => {
  return (
    <DeleteButton
      ref={ref}
      height={50}
      width={150}
      onClose={onClose}
      additionalWidth={80}
      onConfirmDeletion={() => {}}
      onInitialClick={onInitialClick}
    />
  );
});

export { App };
export type { DeleteButtonRef };
