"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
import axios from "axios";

const CardClient = ({
  clients,
  onOrderClick,
  orderDetailsLoadedCallback,
}: {
  clients: any[];
  onOrderClick: (order: any) => void;
  orderDetailsLoadedCallback: (order: any) => void;
}) => {
  
  const handleClick = async (id: number) => {
    orderDetailsLoadedCallback(false);
    try {
      const res = await axios.get(`/api/getOrderDetail/${id}`);
      onOrderClick(res.data.orderDetail);
      orderDetailsLoadedCallback(true);
    } catch (error) {
      console.log(error);
    }
  };
  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-[600px] mx-auto mt-4">
          <CardHeader className="flex gap-3">
            <b>No orders available</b>
          </CardHeader>
        </Card>
      </div>
    );
  } 

  return (
    <>
      {clients.map((client, index) => (
        <div key={index} className="p-4">
          <button
            className="focus:outline-none w-full"
            onClick={() => handleClick(client.idorden)}
          >
            <Card className="w-full">
              <CardHeader className="flex gap-3">
                <Image
                  alt="nextui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md">
                    <b>Order id: </b>
                    {client.idorden}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>
                  <b>Client</b>: {client.cliente}
                </p>
                <Divider />
                <p>
                  <b>Destination</b>: {client.destino}
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <p>
                  <b>Day departure</b>: {client.fecha_despacho}
                </p>
              </CardFooter>
            </Card>
          </button>
        </div>
      ))}
    </>
  );
};

export default CardClient;
