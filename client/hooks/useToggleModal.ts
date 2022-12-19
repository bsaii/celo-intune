import { useState } from 'react';

export function useToggleModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleConfirm = (
    open: boolean = !isModalOpen,
    cb: () => any = () => {},
  ) => {
    setIsModalOpen(open);
    return cb;
  };

  return { isModalOpen, toggleConfirm };
}
