"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  CardFooter,
  Input,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import ModalSmall from "../modal/Modal";
import { updateStateDeliveryPalett } from "@/lib/actions";

const RightSideContent = ({
  selectedOrder,
  orderNumber,
}: {
  selectedOrder: any;
  orderNumber: any;
}) => {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const handleMainModalOpen = () => setIsMainModalOpen(true);
  const handleMainModalClose = () => setIsMainModalOpen(false);

  const handleSecondModalOpen = () => setIsSecondModalOpen(true);
  const handleSecondModalClose = () => setIsSecondModalOpen(false);

  const [deliveryData, setDeliveryData] = useState([]);
  const [secondaryModalData, setSecondaryModalData] = useState([]);
  const handlerClickDeliveryPallet = async (idorden_idpunnet: any) => {
    // Open modal
    handleMainModalOpen();
    // Fetch data
    try {
      const res = await axios.get(`/api/getDeliveryPallet/${idorden_idpunnet}`);
      setDeliveryData(res.data); // Set the fetched data into state
    } catch (error) {
      console.error("Error fetching delivery pallet", error);
    }
  };

  const handleRowClick = async (idorden_idpunnet: any, iddelivery: number) => {
    if (confirm("Do you want to start this dellivery pallet?")) {
      console.log(iddelivery);
      const res = await axios.get(`/api/updateDeliveryPalletState/${iddelivery}`);
      console.log("Status query /api/updateDeliveryPalletState/", res.status);
      
      if (res.status === 200) {
        try {
          const res = await axios.get(
            `/api/getReceptionAsociadosOrder/${idorden_idpunnet}`
          );
          setSecondaryModalData(res.data); // Set the.data);
        } catch (error) {
          console.log("Error fetching row", error);
        }
        handleSecondModalOpen();
      }
    }
  };

  if ((!selectedOrder || selectedOrder.length === 0) && orderNumber > 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-[600px] mx-auto mt-4">
          <CardHeader className="flex gap-3">
            <b>No order selected</b>
          </CardHeader>
          <CardBody>
            <p>Please select an order to view the details.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (orderNumber > 0) {
    return (
      <div className="space-y-4 px-4">
        {selectedOrder.map((order: any, index: any) => (
          <Card key={index} className="max-w-[600px] mx-auto">
            <CardHeader className="flex gap-3">
              <b>Order details</b>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex flex-wrap mb-4">
                <div className="w-full sm:w-3/12 flex items-center">
                  <b>Idorden</b>
                </div>
                <div className="w-full sm:w-9/12">
                  <Input
                    type="text"
                    value={order.idorden}
                    readOnly
                    name="idorden"
                    fullWidth
                  />
                </div>
              </div>

              <div className="flex flex-wrap mb-4">
                <div className="w-full sm:w-3/12 flex items-center">
                  <b>Punnet</b>
                </div>
                <div className="w-full sm:w-9/12">
                  <Input
                    type="text"
                    value={order.punnet || ""}
                    readOnly
                    name="punnet"
                    fullWidth
                  />
                </div>
              </div>

              <div className="flex flex-wrap mb-4">
                <div className="w-full sm:w-3/12 flex items-center">
                  <b>Carton bay</b>
                </div>
                <div className="w-full sm:w-9/12">
                  <Input
                    type="text"
                    value={order.carton_bax || ""}
                    readOnly
                    name="carton_bay"
                    fullWidth
                  />
                </div>
              </div>

              <div className="flex flex-wrap mb-4">
                <div className="w-full sm:w-3/12 flex items-center">
                  <b>Number pallet</b>
                </div>
                <div className="w-full sm:w-9/12">
                  <Input
                    type="text"
                    value={order.can_pal || ""}
                    readOnly
                    name="number_pallet"
                    fullWidth
                  />
                </div>
              </div>
              <button
                onClick={() =>
                  handlerClickDeliveryPallet(order.idorden + "_" + order.id)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Get number_pallet
              </button>
              <>
                <Modal
                  size="full"
                  isOpen={isMainModalOpen}
                  onClose={handleMainModalClose}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Table
                        </ModalHeader>
                        <ModalBody
                          style={{ maxHeight: "80vh", overflow: "auto" }}
                        >
                          <Table aria-label="Example static collection table">
                            <TableHeader>
                              <TableColumn>ID</TableColumn>
                              <TableColumn>Nr Pallet</TableColumn>
                              <TableColumn>Nr Bax</TableColumn>
                              <TableColumn>KG</TableColumn>
                              <TableColumn>Bax Added</TableColumn>
                              <TableColumn>Status</TableColumn>
                              <TableColumn>Select</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {deliveryData.map((entry: any) => (
                                <TableRow key={entry.iddelivery}>
                                  <TableCell>{entry.iddelivery}</TableCell>
                                  <TableCell>{entry.nrpallet}</TableCell>
                                  <TableCell>{entry.nr_bax}</TableCell>
                                  <TableCell>{entry.kg}</TableCell>
                                  <TableCell>{entry.bax_add}</TableCell>
                                  <TableCell>{entry.state}</TableCell>
                                  <TableCell>
                                    <Button
                                      color="primary"
                                      onClick={() => {
                                        handleRowClick(
                                          order.idorden + "_" + order.id,
                                          entry.iddelivery
                                        );
                                      }}
                                    >
                                      Select dellivery
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
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
                <Modal
                  isOpen={isSecondModalOpen}
                  onClose={handleSecondModalClose}
                  backdrop="blur"
                  size="5xl"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Secondary Modal
                        </ModalHeader>
                        <ModalBody>
                        <Table>
                          <TableHeader>
                            <TableColumn> </TableColumn>
                            <TableColumn>id</TableColumn>
                            <TableColumn>fecha</TableColumn>
                            <TableColumn>idorden</TableColumn>
                            <TableColumn>idpunnet</TableColumn>
                            <TableColumn>nropallet_recepcion</TableColumn>
                            <TableColumn>estado</TableColumn>
                          </TableHeader>
                          <TableBody>
                            {secondaryModalData.map((data: any) => (
                              <TableRow>
                                <TableCell>s</TableCell>
                                <TableCell>{data.id}</TableCell>
                                <TableCell>{data.fecha}</TableCell>
                                <TableCell>{data.idorden}</TableCell>
                                <TableCell>{data.idpunnet}</TableCell>
                                <TableCell>{data.nropallet_recepcion}</TableCell>
                                <TableCell>{data.estado}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </>
            </CardBody>
            <Divider />
            <CardFooter></CardFooter>
          </Card>
        ))}
        {/* {isModalSmallOpen && (
          <ModalSmall onClose={() => setIsModalSmallOpen(false)} />
        )}{" "}
        else */}
      </div>
    );
  }

  return <></>;
};

export default RightSideContent;
