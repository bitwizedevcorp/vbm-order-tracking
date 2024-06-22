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
  ButtonGroup,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Chip,
  Progress,
  Select,
  SelectItem,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { ChangeEvent } from "react";
import axios from "axios";

const RightSideContent = ({
  selectedOrder,
  orderNumber,
  orderDetailsLoaded,
}: {
  selectedOrder: any;
  orderNumber: any;
  orderDetailsLoaded: any;
}) => {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
  const [isFourthModalOpen, setIsFourthModalOpen] = useState(false);
  const [baxesValue, setBaxesValue] = useState<string>("");
  const [baxesValueTotalComputation, setBaxesValueTotalComputation] = useState<{
    _total: Number;
    _text: String;
  }>({ _total: 0, _text: "" });
  const [querryDoneForPunnet, setQuerryDoneForPunent] =
    useState<boolean>(false);
  const [dataWeightPunnet, setDataWeightPunnet] = useState<string>("");
  const [showSecondContent, setShowSecondContent] = useState(false);

  const handleMainModalOpen = () => setIsMainModalOpen(true);
  const handleMainModalClose = () => setIsMainModalOpen(false);

  const handleSecondModalOpen = () => setIsSecondModalOpen(true);
  const handleSecondModalClose = () => setIsSecondModalOpen(false);

  const handleThirdModalOpen = () => setIsThirdModalOpen(true);
  const handleThirdModalClose = () => setIsThirdModalOpen(false);

  const handleFourthModalOpen = () => setIsFourthModalOpen(true);
  const handleFourthModalClose = () => setIsFourthModalOpen(false);

  const [deliveryData, setDeliveryData] = useState([]);
  const [secondaryModalData, setSecondaryModalData] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentOrderInfo, setCurrentOrderInfo] = useState<any>({});
  const [nrPalletDelivery, setNrPalletDelivery] = useState("");
  const [nrPalletsDeliveryInProgress, setNrPalletsDeliveryInProgress] =
    useState<any>({});
  const [linesAvailable, setLinesAvailable] = useState<any[]>([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<any>();

  const handleSelectionChange = (e: any) => {
    nrPalletsDeliveryInProgress[nrPalletDelivery] = e; // 1st way working for all in progress
    setSelectedKeys(e); // 2nd way working for just 1
  };

  console.log("Order details loaded from rightside: ", orderDetailsLoaded);
  console.log("Selected order", selectedOrder);

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
    if (
      confirm(`Do you want to start this delivery pallet number ${nrpallet}?`)
    ) {
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
          // nrPalletsDeliveryInProgress[nrPalletDelivery] = "" // E ok aici asta daca aici se pune status in progress. TODO: Pop nr pallet when finalized
        } catch (error) {
          console.error("Error fetching row", error);
        }
        handleSecondModalOpen();
      }
    }
  };

  // TODO: Delete it+depds. Not needed anymore
  const handleCheckboxChange = (data: any) => {
    // console.log("rowclick", data);
    // if (checked) {
    //   setSelectedRows([...selectedRows, data]);
    // } else {
    //   setSelectedRows(selectedRows.filter((row) => row.id !== data.id));
    // }
  };

  const handleSecondaryModalButtonClick = async () => {
    if (selectedKeys.size === 0) {
      // No keys selected
      alert("Nothing selected");
    } else {
      // Find the pallet you clicked currently on
      nrPalletsDeliveryInProgress[nrPalletDelivery] = selectedKeys;
      console.log("rowclick", nrPalletsDeliveryInProgress);

      try {
        const res = await axios.get("/api/getLines");
        console.log(res.data);
        setLinesAvailable(res.data);
      } catch (error) {
        console.log("Error at fetching lines from dbs", error);
      }
      handleThirdModalOpen();
    }
  };

  const renderStatusCell = (data: any): JSX.Element => {
    let _text = data.state;
    let _color:
      | "primary"
      | "warning"
      | "success"
      | "default"
      | "secondary"
      | "danger"
      | undefined = "primary";

    switch (data.state) {
      case 1:
        _text = "Waiting";
        _color = "warning";
        break;
      case 2:
        _text = "Processing";
        _color = "success";
        break;

      default:
        _text = data.state;
        _color = "primary";
        break;
    }

    return (
      <TableCell>
        <Chip className="capitalize" color={_color} size="sm" variant="flat">
          {_text}
        </Chip>
      </TableCell>
    );
  };

  const renderSingleButton = (order: any, entry: any): JSX.Element => {
    return (
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
    );
  };

  const renderDoubleButton = (order: any, entry: any): JSX.Element => {
    return (
      <ButtonGroup>
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
        <Button
          color="success"
          onClick={() => {
            handleAddBoxesButton(order.punnet, entry.nrpallet);
          }}
        >
          Add baxes
        </Button>
      </ButtonGroup>
    );
  };

  const handleAddBoxesButton = async (punnet: any, nrPalletClicked: any) => {
    handleFourthModalOpen();
    console.log("pun", punnet, nrPalletClicked);
    // if (!querryDoneForPunnet) {
    //   try {
    //     const res = await axios.get(`/api/getProductWeight/${punnet}`);
    //     setQuerryDoneForPunent(true);
    //     setDataWeightPunnet(res.data.orderDetail.weight);
    //   } catch (error) {
    //     setQuerryDoneForPunent(false);
    //     console.log("Cannot fetch getProductWeight", error);
    //   }

    //   setQuerryDoneForPunent(true);
    // }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleSelectChange = (event: any) => {
    setSelectedLine(event.target.value);
  };

  const handleAddLineButton = async (data: any) => {
    //validate input
    let inputIsOk: boolean = true;
    if (selectedLine === "") {
      inputIsOk = false;
    }

    if (inputIsOk) {
      const { idorden_idpunnet } = currentOrderInfo; // Assuming currentOrderInfo is defined elsewhere
      let workLine = "";
      const payload = {
        idorden_idpunnet,
        selectedRows,
        workLine,
        nrPalletDelivery,
      };

      console.log("Payload before prompt:", payload);

      payload.workLine = selectedLine;

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
    }

    //close modal 3
    handleThirdModalClose();
  };

  const handleAddTotalKgButton = async () => {
    setShowSecondContent(true);
  };

  const handleGroupButtonClick = async (answer: any) => {
    const dataToInsert = {
      numberBaxes: baxesValue,
      kgUsedBaxes: baxesValueTotalComputation._total,
      nropallet_recepcion: selectedRows[0].nropallet_recepcion,
      state: 0,
    };

    if (answer === "no") {
      dataToInsert.state = 1;

      try {
        console.log("datatoinsert", dataToInsert);
        const res = await axios.post(`/api/updateTbReceptionNo/`, dataToInsert);
      } catch (error) {}
    } else {
      dataToInsert.state = 3;
    }

    setShowSecondContent(false);
    setIsFourthModalOpen(false);
  };

  useEffect(() => {
    if (isFourthModalOpen) {
      if (querryDoneForPunnet) {
        if (dataWeightPunnet !== "") {
          const kgFromDB = Number(dataWeightPunnet);
          let total: Number = 0;

          total = kgFromDB * Number(baxesValue);
          if (!baxesValue || baxesValue === "0") {
            setBaxesValueTotalComputation({ _total: total, _text: "" });
          } else {
            setBaxesValueTotalComputation({
              _total: total,
              _text:
                baxesValue +
                "*" +
                String(kgFromDB) +
                "kg = " +
                String(total) +
                "kg",
            });
          }

          //baxesValueTotalComputation._total should be added in DBs
        } else {
          //got empty res from dbs
        }
      } else {
        //loading
      }
    }
  });

  useEffect(() => {
    if (isMainModalOpen) {
      const interval = setInterval(async () => {
        if (currentOrderInfo.idorden_idpunnet) {
          try {
            const res = await axios.get(
              `/api/getDeliveryPallet/${currentOrderInfo.idorden_idpunnet}`
            );
            setDeliveryData(res.data);
          } catch (error) {
            console.error("Error fetching delivery data", error);
          }
        }
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [isMainModalOpen, currentOrderInfo]);

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
                                  <TableCell>{entry.nrpallet}</TableCell>
                                  <TableCell>{entry.nr_bax}</TableCell>
                                  <TableCell>{entry.kg}</TableCell>
                                  <TableCell>{entry.bax_add}</TableCell>
                                  {renderStatusCell(entry)}
                                  <TableCell>
                                    {entry.state === 2
                                      ? renderDoubleButton(order, entry)
                                      : renderSingleButton(order, entry)}
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
                          <Table
                            color={"success"}
                            selectionMode="single"
                            selectedKeys={
                              nrPalletsDeliveryInProgress[nrPalletDelivery]
                            }
                            onSelectionChange={(e) => handleSelectionChange(e)}
                          >
                            <TableHeader>
                              <TableColumn>fecha</TableColumn>
                              <TableColumn>Kg Availablle</TableColumn>
                              <TableColumn>Bax Available</TableColumn>
                              <TableColumn>nropallet_recepcion</TableColumn>
                              <TableColumn>estado</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {secondaryModalData.map((data: any) => (
                                <TableRow key={data.id}>
                                  <TableCell>
                                    {formatDate(data.fecha)}
                                  </TableCell>
                                  <TableCell>{data.kg_disponible}</TableCell>
                                  <TableCell>{data.box_disponible}</TableCell>
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
                <Modal
                  backdrop="opaque"
                  isOpen={isThirdModalOpen}
                  onClose={handleThirdModalClose}
                  radius="lg"
                  className="dark text-foreground bg-background"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Select a line
                        </ModalHeader>
                        <ModalBody>
                          <Select
                            items={linesAvailable}
                            label="Select"
                            placeholder="Select a line"
                            className="max-w-xs"
                            onChange={handleSelectChange}
                          >
                            {linesAvailable.map((data: any) => (
                              <SelectItem key={data.id}>
                                {data.linea}
                              </SelectItem>
                            ))}
                          </Select>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="success"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
                            onClick={handleAddLineButton}
                          >
                            Add
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>

                <Modal
                  backdrop="opaque"
                  isOpen={isFourthModalOpen}
                  onClose={handleFourthModalClose}
                  radius="lg"
                  className="dark text-foreground bg-background"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        {!showSecondContent ? (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              Baxes
                            </ModalHeader>
                            <ModalBody>
                              <Input
                                label="Enter baxes number"
                                placeholder="E.g.: 12"
                                type="number"
                                value={baxesValue}
                                onValueChange={setBaxesValue}
                              />
                              <p>
                                {"Total: " + baxesValueTotalComputation._text}
                              </p>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color="success"
                                variant="light"
                                onPress={onClose}
                              >
                                Close
                              </Button>
                              <Button
                                className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
                                onClick={handleAddTotalKgButton}
                              >
                                Add
                              </Button>
                            </ModalFooter>
                          </>
                        ) : (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              Is pallet partially finished?
                            </ModalHeader>
                            <ModalBody className="flex justify-center">
                              <Button
                                className="m-2"
                                onClick={() => handleGroupButtonClick("yes")}
                              >
                                Yes
                              </Button>
                              <Button
                                className="m-2"
                                onClick={() => handleGroupButtonClick("no")}
                              >
                                No
                              </Button>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color="success"
                                variant="light"
                                onPress={onClose}
                              >
                                Close
                              </Button>
                            </ModalFooter>
                          </>
                        )}
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
