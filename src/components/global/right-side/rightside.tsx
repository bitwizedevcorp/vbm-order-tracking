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
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  useDisclosure
} from "@nextui-org/react";
import axios from "axios";

const RightSideContent = ({ selectedOrder, orderNumber }: { selectedOrder: any, orderNumber: any }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  let arr: any[] = [];

  const handlerClickDeliveryPallet = async (idorden_idpunnet: any) => {
    //Open modal
    onOpen();
    //Fetch data
    console.log(idorden_idpunnet);
    try {
      const res = await axios.get(`/api/getDeliveryPallet/${idorden_idpunnet}`);
      arr = [...Array(4)].map((u, i) => i);
      console.log("res", res.data);
    } catch (error) {
      console.error("Error fetching delivery pallet", error);
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
        {selectedOrder.map((order: any, index: number) => (
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
                  isOpen={isOpen} 
                  onClose={onClose} 
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">Table</ModalHeader>
                        <ModalBody>
                          <Table aria-label="Example static collection table">
                            <TableHeader>
                              <TableColumn>ID</TableColumn>
                              <TableColumn>Something</TableColumn>
                              <TableColumn>STATUS</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {arr.map((entry) => (
                                <TableRow key={entry}>
                                  <TableCell>Tony Reichert</TableCell>
                                  <TableCell>CEO</TableCell>
                                  <TableCell>Active</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
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
            </CardBody>
            <Divider />
            <CardFooter></CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (<></>);
  
};

export default RightSideContent;
