"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Button,
} from "@nextui-org/react";
import axios from "axios";

const CardClient = ({
  clients,
  onOrderClick,
  orderDetailsLoadedCallback,
}: any) => {
  const handleClick = async (id: any) => {
    orderDetailsLoadedCallback(false);
    onOrderClick({ dummy: "dummy" }); // Send a dummy object for the loading screen to be triggered. If statement needs a non-empty variable to check for loading rendering
    try {
      const res = await axios.get(`/api/getOrderDetail/${id}`);
      onOrderClick(res.data.orderDetail);
      orderDetailsLoadedCallback(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinishOrderButton = async () => {
    try {
      const res = await axios.get(`/api/finishOrder/${clients[0].idorden}`);
      if (res.status === 200) {
        alert("Order is finished!");
      } else if (res.status === 403) {
        alert("We can't finish the order yet!");
      } else {
        alert("Unexpected response status: " + res.status);
      }
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response);
        if (error.response.status === 500) {
          alert("Internal server error. Please try again later.");
        } else {
          alert("An error occurred: " + error.response.data.message);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        alert(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        alert("An error occurred: " + error.message);
      }
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
      {clients.map((client: any, index: any) => (
        <div key={index} className="p-4">
          <button
            className="focus:outline-none w-full"
            onClick={() => handleClick(client.idorden)}
          >
            <Card className="w-full">
              <CardHeader className="flex gap-3 justify-between">
                <div className="flex items-center gap-3">
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
                </div>
                <div className="flex items-center">
                  <Button color="success" onClick={handleFinishOrderButton}>
                    Finish order
                  </Button>
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
