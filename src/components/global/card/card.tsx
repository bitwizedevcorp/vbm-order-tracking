"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
import axios from "axios";

const CardClient = ({ clients }: { clients: any[] }) => {
  const [clickedData, setClickedData] = useState<any[]>([]);

  const handleClick = async (id: number) => {
    try {
      const res = await axios.get(`/api/getOrderDetail/${id}`);
      console.log(res.data);
      setClickedData(res.data);
    } catch (error) {
      console.log(error);
      setClickedData([]);
    }
  };

  return (
    <div>
      {clients.map((client, index) => (
        <div key={index}>
          <button
            className="focus:outline-none"
            onClick={() => handleClick(client.idorden)}
          >
            <Card className="max-w-[400px]">
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
          <br />
          <Divider />
          <br />
        </div>
      ))}
      {clickedData.length > 0 && (
        <div>
          <h2>Clicked Data:</h2>
          <pre>{JSON.stringify(clickedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CardClient;
