import { useState } from 'react';

export function useModal() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const openModal = props => {
    setIsOpen(true);

    setModalProps(props);
  };
  const closeModal = () => setIsOpen(false);

  return {
    modalIsOpen,
    openModal,
    closeModal,
    modalProps,
  };
}
