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

const RightSideContent = ({ selectedOrder }: { selectedOrder: any }) => {
  if (!selectedOrder || selectedOrder.length === 0) {
    return (
      <Card className="max-w-[600px]">
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
    <div className="space-y-4">
      {selectedOrder.map((order: any, index: number) => (
        <Card key={index} className="max-w-[600px]">
          <CardHeader className="flex gap-3">
            <b>Order details</b>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex mb-4">
              <div className="w-3/12 flex items-center">
                <b>Idorden</b>
              </div>
              <div className="w-9/12">
                <Input
                  type="text"
                  value={order.idorden}
                  readOnly
                  name="idorden"
                />
              </div>
            </div>

            <div className="flex mb-4">
              <div className="w-3/12 flex items-center">
                <b>Punnet</b>
              </div>
              <div className="w-9/12">
                <Input
                  type="text"
                  value={order.punnet || ""}
                  readOnly
                  name="punnet"
                />
              </div>
            </div>

            <div className="flex mb-4">
              <div className="w-3/12 flex items-center">
                <b>Carton bay</b>
              </div>
              <div className="w-9/12">
                <Input
                  type="text"
                  value={order.carton_bax || ""}
                  readOnly
                  name="carton_bay"
                />
              </div>
            </div>

            <div className="flex mb-4">
              <div className="w-3/12 flex items-center">
                <b>Number pallet</b>
              </div>
              <div className="w-9/12">
                <Input
                  type="text"
                  value={order.can_pal || ""}
                  readOnly
                  name="number_pallet"
                />
              </div>
            </div>
          </CardBody>
          <Divider />
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RightSideContent;
