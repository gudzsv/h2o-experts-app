import { useState } from 'react';

export function useModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const openModal = props => {
    setModalIsOpen(true);

    setModalProps(props);
  };
  const closeModal = () => setModalIsOpen(false);

  return {
    modalIsOpen,
    openModal,
    closeModal,
    modalProps,
  };
}
