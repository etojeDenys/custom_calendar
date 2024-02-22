import React from "react";
import Modal from "react-modal";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

const BaseModal: React.FC<Props> = ({ isOpen, closeModal, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnEsc
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          overflow: "visible",
          position: "relative",
          width: "35vw",
          height: "25vw",
        },
      }}
      preventScroll
      onRequestClose={closeModal}
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
