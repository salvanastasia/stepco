import { DeleteButton } from './components/delete-button';

type Props = {
  onClose?: () => void;
  onInitialClick?: () => void;
};
const App = ({ onClose, onInitialClick }: Props) => {
  return (
    <DeleteButton
      height={50}
      width={150}
      onClose={onClose}
      additionalWidth={80}
      onConfirmDeletion={() => {}}
      onInitialClick={onInitialClick}
    />
  );
};

export { App };
