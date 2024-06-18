import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
//{ idorden_idpunnet }: any
const ModalSmall = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    const getReceptionAsocoadosOrder = async () => {
      try {
        // const res = await axios.get(
        //   `/api/getReceptionAsociadosOrder/${idorden_idpunnet}`
        // );
        // console.log(res.data);
        // setDeliveryData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isOpen) {
      getReceptionAsocoadosOrder();
    }
  }, [isOpen]);

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                {deliveryData.length > 0 ? (
                  deliveryData.map((data: any) => (
                    <p key={data.id}>{JSON.stringify(data)}</p>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalSmall;
