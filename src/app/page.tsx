"use client";
import React, { useState, useEffect } from "react";
import { Spinner, Progress } from "@nextui-org/react";
import CardClient from "@/components/global/card/card";
import RightSideContent from "@/components/global/right-side/rightside";
import axios from "axios";

const Home = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState<any>(false);
  const [orderDetailsLoaded, setOrderDetailsLoaded] = useState<any>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getClientWithSixState");
        const clientData = res.data;

        const formattedData = clientData.map((item: any) => ({
          ...item,
          fecha_despacho: new Date(item.fecha_despacho).toLocaleDateString(), // Ensure proper date formatting
        }));
        setData(formattedData);
        setOrdersLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const handleOrderDetailsLoadedCallback = (data: any) => {
    setOrderDetailsLoaded(data);
    console.log("Order details loaded from leftside: ", data);
  };

  return (
    <div className="flex h-screen">
      <div className="w-[35%] bg-gray-100">
        {!ordersLoaded ? (
          <div className="p-4 flex justify-center">
            <Progress
              size="sm"
              color="primary"
              isIndeterminate
              aria-label="Loading..."
              className="max-w-md"
            />
          </div>
        ) : (
          <CardClient clients={data} onOrderClick={handleOrderClick} orderDetailsLoadedCallback={handleOrderDetailsLoadedCallback}/>
        )}
      </div>
      <div className="w-[65%] bg-white">
        <div className="p-4">
          <RightSideContent
            selectedOrder={selectedOrder}
            orderNumber={data.length}
            orderDetailsLoaded={orderDetailsLoaded}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
