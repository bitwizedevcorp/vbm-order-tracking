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
  Checkbox,
  Chip,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import ModalSmall from "../modal/Modal";
import { updateStateDeliveryPalett } from "@/lib/actions";

const RightSideContent = ({
  selectedOrder,
  orderNumber,
  orderDetailsLoaded
}: {
  selectedOrder: any;
  orderNumber: any;
  orderDetailsLoaded: any;
}) => {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  
  const handleMainModalOpen = () => setIsMainModalOpen(true);
  const handleMainModalClose = () => setIsMainModalOpen(false);

  const handleSecondModalOpen = () => setIsSecondModalOpen(true);
  const handleSecondModalClose = () => setIsSecondModalOpen(false);

  const [deliveryData, setDeliveryData] = useState([]);
  const [secondaryModalData, setSecondaryModalData] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentOrderInfo, setCurrentOrderInfo] = useState<any>({});
  const [nrPalletDelivery, setNrPalletDelivery] = useState("");
  console.log("Order details loaded from rightside: ", orderDetailsLoaded);
  const handlerClickDeliveryPallet = async (idorden_idpunnet: any) => {
    handleMainModalOpen();
    try {
      const res = await axios.get(`/api/getDeliveryPallet/${idorden_idpunnet}`);
      setDeliveryData(res.data);
    } catch (error) {
      console.error("Error fetching delivery pallet", error);
    }
  };

  const handleRowClick = async (
    idorden_idpunnet: any,
    iddelivery: number,
    nrpallet: string
  ) => {
    if (confirm("Do you want to start this delivery pallet?")) {
      const res = await axios.get(
        `/api/updateDeliveryPalletState/${iddelivery}`
      );

      if (res.status === 200) {
        try {
          const res = await axios.get(
            `/api/getReceptionAsociadosOrder/${idorden_idpunnet}`
          );
          setSecondaryModalData(res.data);
          setCurrentOrderInfo({ idorden_idpunnet, iddelivery });
          setNrPalletDelivery(nrpallet); //
        } catch (error) {
          console.error("Error fetching row", error);
        }
        handleSecondModalOpen();
      }
    }
  };

  const handleCheckboxChange = (data: any, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, data]);
    } else {
      setSelectedRows(selectedRows.filter((row) => row.id !== data.id));
    }
  };

  const handleSecondaryModalButtonClick = async () => {
    const { idorden_idpunnet } = currentOrderInfo; // Assuming currentOrderInfo is defined elsewhere
    let workLine = "";
    const payload = {
      idorden_idpunnet,
      selectedRows,
      workLine,
      nrPalletDelivery,
    };

    console.log("Payload before prompt:", payload);

    let line = prompt("Please enter line:");
    if (line === null || line === "") {
      console.log("User cancelled the prompt.");
      return;
    }

    payload.workLine = line;

    console.log(payload);

    for (const row of payload.selectedRows) {
      let id = row.nropallet_recepcion;
      try {
        const res = await axios.get(`/api/updateReceptionState/${id}`);
        console.log(
          "Updated reception state for ID:",
          id,
          "Response:",
          res.data
        );
      } catch (error) {
        console.error("Error updating reception state:", error);
        alert("Can not update reception state");
        return;
      }
    }

    try {
      const res = await axios.post("/api/deliveryReception/", { payload });
      if (res.status === 200) {
        alert("Success: Data added successfully");
      } else {
        alert("Error: Incorrect number of lines or something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderStatusCell = (data: any): JSX.Element => {
    let _text = data.state;
    let _color: "primary" | "warning" | "success" | "default" | "secondary" | "danger" | undefined = "primary";

    switch (data.state) {
      case 1:
        _text = "Waiting"
        _color = "warning"
        break;
      case 2:
        _text = "Processing"
        _color = "success"
        break;
    
      default:
        _text = data.state
        _color = "primary"
        break;
    }

    return (
      <TableCell>
        <Chip className="capitalize" color={_color} size="sm" variant="flat">
          {_text}
        </Chip>
      </TableCell>
    )                        
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

  if (selectedOrder && !orderDetailsLoaded) {
    return (
      <Progress
        size="sm"
        color="success"
        isIndeterminate
        aria-label="Loading..."
        className="max-w-md"
      />
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
                                  {renderStatusCell(entry)}
                                  <TableCell>
                                    <Button
                                      color="primary"
                                      onClick={() => {
                                        handleRowClick(
                                          order.idorden + "_" + order.id,
                                          entry.iddelivery,
                                          entry.nrpallet
                                        );
                                      }}
                                    >
                                      Select delivery
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
                                <TableRow key={data.id}>
                                  <TableCell>
                                    <Checkbox
                                      size="lg"
                                      value={data.id}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          data,
                                          e.target.checked
                                        )
                                      }
                                    ></Checkbox>
                                  </TableCell>
                                  <TableCell>{data.id}</TableCell>
                                  <TableCell>{data.fecha}</TableCell>
                                  <TableCell>{data.idorden}</TableCell>
                                  <TableCell>{data.idpunnet}</TableCell>
                                  <TableCell>
                                    {data.nropallet_recepcion}
                                  </TableCell>
                                  <TableCell>{data.estado}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <Button
                            onClick={handleSecondaryModalButtonClick}
                            color="success"
                          >
                            Use selected boxes
                          </Button>
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
      </div>
    );
  }

  return <></>;
};

export default RightSideContent;
