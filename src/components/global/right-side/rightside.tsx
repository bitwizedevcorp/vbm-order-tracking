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
  Spinner,
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
  const handleFourthModalClose = () => {
    setIsFourthModalOpen(false);
    setShowSecondContent(false);
  };

  const [deliveryData, setDeliveryData] = useState([]);
  const [secondaryModalData, setSecondaryModalData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentOrderInfo, setCurrentOrderInfo] = useState<any>({});
  const [nrPalletDelivery, setNrPalletDelivery] = useState("");
  const [nrPalletsDeliveryInProgress, setNrPalletsDeliveryInProgress] =
    useState<any>({});
  const [linesAvailable, setLinesAvailable] = useState<any[]>([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<any>();
  const [boxesButtonClickId, setBoxesButtonClickId] = useState<any>();
  const [secondaryModelDataLoaded, setSecondaryModelDataLoaded] =
    useState<any>();
  const [addLineButtonTriggered, setAddLineButtonTriggered] =
    useState<any>(false);
  const [idDeliveryClicked, setIdDeliveryClicked] = useState<any>();

  const handleSelectionChange = (e: any) => {
    nrPalletsDeliveryInProgress[nrPalletDelivery] = e; // 1st way working for all in progress
    setSelectedKeys(e); // 2nd way working for just 1
  };

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
      setSecondaryModelDataLoaded(false);
      handleSecondModalOpen();
      const res = await axios.get(
        `/api/updateDeliveryPalletState/${iddelivery}`
      );
      if (res.status === 200) {
        try {
          const res = await axios.get(
            `/api/getReceptionAsociadosOrder/${idorden_idpunnet}`
          );
          setSecondaryModelDataLoaded(true);
          setSecondaryModalData(res.data);
          setCurrentOrderInfo({ idorden_idpunnet, iddelivery });
          setNrPalletDelivery(nrpallet); //
          // nrPalletsDeliveryInProgress[nrPalletDelivery] = "" // E ok aici asta daca aici se pune status in progress. TODO: Pop nr pallet when finalized
        } catch (error) {
          console.error("Error fetching row", error);
        }
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
    console.log("select", selectedKeys);
    if (!selectedKeys) {
      // No keys selected
      alert("Nothing selected");
    } else {
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
      case 3:
        _text = "Partially finished";
        _color = "warning";
        break;
      case 4:
        _text = "Finished";
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

  const handleFinishButton = async (iddelivery: any) => {
    try {
      const res = await axios.get(`/api/finishDeliverPallet/${iddelivery}`);
      if (res.status === 200) {
        alert("This pallet was finished");
      } else {
        alert("The pallet wasn`t finished");
      }
    } catch (error) {
      console.log("ddd", error);
    }
  };

  const renderDoubleButton = (order: any, entry: any): JSX.Element => {
    // console.log("nrr", Number(entry.nr_bax));
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
            handleAddBoxesButton(
              order.punnet,
              order.idpunnet,
              entry.nrpallet,
              entry.iddelivery
            );
          }}
        >
          Add baxes
        </Button>
        {Number(entry.bax_add) > 0 ? (
          <Button
            color="warning"
            onClick={() => {
              handleFinishButton(entry.iddelivery);
            }}
          >
            Finish pallet
          </Button>
        ) : (
          ""
        )}
      </ButtonGroup>
    );
  };

  const handleAddBoxesButton = async (
    punnet: any,
    idpunnet: any,
    nrPalletClicked: any,
    iddelivery: any
  ) => {
    setBoxesButtonClickId(nrPalletClicked);
    setIdDeliveryClicked(iddelivery);
    handleFourthModalOpen();
    console.log("pun", punnet, nrPalletClicked);
    if (!querryDoneForPunnet) {
      try {
        console.log("orderDetailed", punnet);
        const res = await axios.get(`/api/getProductWeight/${idpunnet}`);
        setQuerryDoneForPunent(true);
        setDataWeightPunnet(res.data.orderDetail.weight);
      } catch (error) {
        setQuerryDoneForPunent(false);
        console.log("Cannot fetch getProductWeight", error);
      }

      setQuerryDoneForPunent(true);
    }
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
    setAddLineButtonTriggered(true);
    let inputIsOk: boolean = true;
    let _selectedRows = [
      nrPalletsDeliveryInProgress[nrPalletDelivery].currentKey,
    ];

    const _nropallet_recepcion = secondaryModalData.find(
      (data) => data.id === Number(_selectedRows[0])
    );

    if (selectedLine === "") {
      inputIsOk = false;
    }

    if (inputIsOk) {
      const { idorden_idpunnet } = currentOrderInfo; // Assuming currentOrderInfo is defined elsewhere
      let workLine = "";
      const payload = {
        idorden_idpunnet,
        selectedRows: _selectedRows,
        workLine,
        nrPalletDelivery,
        nropallet_recepcion: _nropallet_recepcion.nropallet_recepcion,
      };

      console.log("Payload before prompt:", payload);

      payload.workLine = selectedLine;

      console.log(payload);

      for (const row of payload.selectedRows) {
        //let id = row.nropallet_recepcion; // Chair trb aici nropallet reception sau id? Daca trb nropallet recepotion, asta e in _nropallet_recepcion.nropallet_recepcion
        let id = payload.nropallet_recepcion;
        try {
          const res = await axios.get(`/api/updateReceptionState/${id}`);
          // alert("Updated reception state for ID:");
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

          let foundKey: string = "";
          for (const key in nrPalletsDeliveryInProgress) {
            if (
              nrPalletsDeliveryInProgress[key].anchorKey === _selectedRows[0]
            ) {
              foundKey = key;
              break;
            }
          }

          if (foundKey != "") {
            nrPalletsDeliveryInProgress[foundKey]["lastInsertedId"] =
              res.data.data;
          }
          console.log("ROWCL", nrPalletsDeliveryInProgress);
          handleThirdModalClose();
          handleSecondModalClose();
        } else {
          alert("Error: Incorrect number of lines or something went wrong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setAddLineButtonTriggered(false);
    //close modal 3
    handleThirdModalClose();
  };

  const handleAddTotalKgButton = async () => {
    setShowSecondContent(true);
  };

  const handleGroupButtonClick = async (answer: any) => {
    // console.log("secondaryModalData", secondaryModalData)
    let _nropallet_recepcion = "";
    const _id = Number(
      nrPalletsDeliveryInProgress[boxesButtonClickId].currentKey
    );
    for (const i in secondaryModalData) {
      console.log(
        "secondaryModalData",
        secondaryModalData[i],
        Number(nrPalletsDeliveryInProgress[boxesButtonClickId].currentKey)
      );
      if (secondaryModalData[i].id === _id) {
        _nropallet_recepcion = secondaryModalData[i].nropallet_recepcion;
      }
    }

    console.log(
      "secondaryModalData _nropallet_recepcion",
      _nropallet_recepcion
    );
    // console.log("secondaryModalData _nropallet_recepcion",_nropallet_recepcion);
    // console.log("selectedOrder", selectedOrder);
    // if (_nropallet_recepcion !== '')
    const dataToInsert = {
      numberBaxes: baxesValue,
      kgUsedBaxes: baxesValueTotalComputation._total,
      nropallet_recepcion: _nropallet_recepcion,
      state: 0,
      insertedId:
        nrPalletsDeliveryInProgress[boxesButtonClickId]["lastInsertedId"],
      idDeliveryClicked: idDeliveryClicked,
      idOrder: selectedOrder[0].idorden,
      idOrdenDetails: selectedOrder[0].id,
    };

    console.log("datatoinsert:", dataToInsert);

    if (answer === "no") {
      dataToInsert.state = 1;

      try {
        const res = await axios.post(`/api/updateTbReceptionNo/`, dataToInsert);
      } catch (error) {}
    } else {
      console.log("intru in yes");
      dataToInsert.state = 3;
      const res = await axios.post(`/api/updateTbReceptionYes/`, dataToInsert);
    }

    setShowSecondContent(false);
    setIsFourthModalOpen(false);
  };

  const finsihTheOrderDetailsButton = async () => {
    try {
      const res = await axios.get(
        `/api/finshOrderDetail/${selectedOrder[0].id}`
      );
      if (res.status === 200) {
        alert("This order detailed was finished!");
      } else {
        alert("This order detailed wasn`t finished!");
      }
    } catch (error) {
      console.log(error);
    }
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
              _text: String(total) + "kg",
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
            <CardHeader className="flex gap-9">
              <b>Order details</b>

              <p>Status: {order.state}</p>
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
                  <b>Carton bax</b>
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
                Start processing
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
                          Delivery Pallet
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
                              <TableColumn>Kg Added</TableColumn>

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
                                  <TableCell>{entry.kg_add}</TableCell>

                                  {renderStatusCell(entry)}
                                  <TableCell>
                                    {entry.state === 2
                                      ? renderDoubleButton(order, entry)
                                      : ""}
                                    {entry.state === 1
                                      ? renderSingleButton(order, entry)
                                      : ""}
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
                          <Button
                            color="primary"
                            onClick={() => {
                              finsihTheOrderDetailsButton();
                            }}
                          >
                            Finish order detail
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
                          Reception Pallet
                        </ModalHeader>
                        <ModalBody>
                          {secondaryModelDataLoaded ? (
                            <>
                              <Table
                                color={"success"}
                                selectionMode="single"
                                selectedKeys={
                                  nrPalletsDeliveryInProgress[nrPalletDelivery]
                                }
                                onSelectionChange={(e) =>
                                  handleSelectionChange(e)
                                }
                              >
                                <TableHeader>
                                  <TableColumn>fecha</TableColumn>
                                  <TableColumn>Kg Availablle</TableColumn>
                                  <TableColumn>Bax Available</TableColumn>
                                  <TableColumn>nropallet_recepcion</TableColumn>
                                  <TableColumn>state</TableColumn>
                                </TableHeader>
                                <TableBody>
                                  {secondaryModalData.map((data: any) => (
                                    <TableRow key={data.id}>
                                      <TableCell>
                                        {formatDate(data.fecha)}
                                      </TableCell>
                                      <TableCell>
                                        {data.kg_disponible}
                                      </TableCell>
                                      <TableCell>
                                        {data.box_disponible}
                                      </TableCell>
                                      <TableCell>
                                        {data.nropallet_recepcion}
                                      </TableCell>
                                      <TableCell>{data.state}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <Button
                                onClick={handleSecondaryModalButtonClick}
                                color="success"
                              >
                                Use selected pallet
                              </Button>
                            </>
                          ) : (
                            <>
                              <Spinner
                                label="Loading..."
                                color="warning"
                                className="flex justify-center"
                              />
                            </>
                          )}
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
                        {addLineButtonTriggered ? (
                          <>
                            <ModalBody>
                              <Spinner
                                label="Adding in dbs..."
                                color="success"
                                className="flex justify-center"
                              />
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color="success"
                                variant="light"
                                onPress={onClose}
                                isDisabled
                              >
                                Close
                              </Button>
                              <Button
                                className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
                                onClick={handleAddLineButton}
                                isDisabled
                              >
                                Add
                              </Button>
                            </ModalFooter>
                          </>
                        ) : (
                          <>
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
                              Is reception pallet partially finished?
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
