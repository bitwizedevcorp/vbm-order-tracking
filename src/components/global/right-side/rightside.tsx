"use client";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  CardFooter,
  Input,
} from "@nextui-org/react";
import axios from "axios";

const RightSideContent = ({ selectedOrder }: { selectedOrder: any }) => {
  const handlerClickDeliveryPallet = async (idorden_idpunnet: any) => {
    console.log(idorden_idpunnet);
    try {
      const res = await axios.get(`/api/getDeliveryPallet/${idorden_idpunnet}`);
      console.log("res", res.data);
    } catch (error) {
      console.error("Error fetching delivery pallet", error);
    }
  };

  if (!selectedOrder || selectedOrder.length === 0) {
    return (
      <Card className="max-w-[600px] mx-auto mt-4">
        <CardHeader className="flex gap-3">
          <b>No order selected</b>
        </CardHeader>
        <CardBody>
          <p>Please select an order to view the details.</p>
        </CardBody>
      </Card>
    );
  }

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
          </CardBody>
          <Divider />
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RightSideContent;
