import RightSideContent from "@/components/content";
import prisma from "../../lib/prisma";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input} from "@nextui-org/react";

const Home = async () => {
  // async function getClientFromDbWithState() {
  //   try {
  //     const data = await prisma.tb_orden.findMany({
  //       where: {
  //         state: 6,
  //       },
  //     });
  //     const orders = data.map((order) => ({
  //       cliente: order.cliente,
  //       destino: order.destino,
  //       fecha_despacho: order.fecha_despacho,
  //       idorden: order.idorden,
  //     }));

  //     async function getOrderDetails(ids: number[]) {
  //       const orderDetail = await prisma.tb_orden_detail.findMany({
  //         where: {
  //           idorden: {
  //             in: ids,
  //           },
  //         },
  //       });

  //       return orderDetail.map((it) => ({
  //         punnet: it.punnet,
  //         carton_bax: it.carton_bax,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return [];
  //   }
  // }

  async function getClientFromDbWithState() {
    try {
      // Fetch orders with state 6
      const orders = await prisma.tb_orden.findMany({
        where: {
          state: 6,
        },
        select: {
          cliente: true,
          destino: true,
          fecha_despacho: true,
          idorden: true,
        },
      });

      // Extract order IDs
      const orderIds = orders.map((order) => order.idorden);

      // Fetch order details for the extracted order IDs
      const orderDetails = await getOrderDetails(orderIds);

      // Combine order and order details into a single object
      const result = orders.map((order) => {
        const details = orderDetails.find(
          (detail) => detail.idorden === order.idorden
        );
        return {
          cliente: order.cliente,
          destino: order.destino,
          fecha_despacho: order.fecha_despacho,
          idorden: order.idorden,
          punnet: details ? details.punnet : null,
          carton_bax: details ? details.carton_bax : null,
          idpunnet: details ? details.idpunnet : null,
          can_pal: details ? details.can_pal : null,
        };
      });

      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async function getOrderDetails(ids: number[]) {
    const orderDetails = await prisma.tb_orden_detail.findMany({
      where: {
        idorden: {
          in: ids,
        },
      },
      select: {
        idorden: true,
        punnet: true,
        carton_bax: true,
        idpunnet: true,
        can_pal: true,
      },
    });

    return orderDetails;
  }

  async function insertForDeliveryPalet(object: any) {
    const roundedRows = Math.ceil(object.can_pal);

    for (let i = 0; i < roundedRows; i++) {
      try {
        const insertData = await prisma.tb_delivery_pallet.create({
          data: {
            idorden: object.idorden,
            idpunnet_orden: object.idpunnet,
            date_departure: object.fecha_despacho,
            nrpallet: i + 1,
            nr_bax: 0,
            kg: 0,
            quality: 0, // Placeholder value, replace with actual data
            idtransport: 1, // Placeholder value, replace with actual data
            patente: "default_patente", // Placeholder value, replace with actual data
            state: 0, // Placeholder value, replace with actual data
            estado: 0, // Placeholder value, replace with actual data
          },
        });
        return insertData;
      } catch (error) {
        console.error(
          "Error inserting delivery pallet for idorden:",
          object.idorden,
          "nrpallet:",
          i + 1,
          "Error:",
          error
        );
      }
    }
  }
  const data = await getClientFromDbWithState();

  for (const n of data) {
    const test = await insertForDeliveryPalet(n);
    console.log(test);
  }

  return (
    <div className="flex h-screen">
      <div className="w-[35%] bg-gray-100">
        <div className="p-4">
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
              <p className="text-md"><b>Order id: </b>12</p>
            </div>
          </CardHeader>
          <Divider/>
          <CardBody>
            <p><b>Client</b>: LIDL</p>
            <Divider/>
            <p><b>Destination</b>: Bucharest</p>
          </CardBody>
          <Divider/>
          <CardFooter>
            <p><b>Day departure</b>: 09.09.2020</p>
          </CardFooter>
        </Card>

        <br></br>
        <Divider />
        <br></br>

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
              <p className="text-md"><b>Order id: </b>12</p>
            </div>
          </CardHeader>
          <Divider/>
          <CardBody>
            <p><b>Client</b>: LIDL</p>
            <Divider/>
            <p><b>Destination</b>: Bucharest</p>
          </CardBody>
          <Divider/>
          <CardFooter>
            <p><b>Day departure</b>: 09.09.2020</p>
          </CardFooter>
        </Card>

        <br></br>
        <Divider />
        <br></br>

        </div>
      </div>
      <div className="w-[65%] bg-white">
        <div className="p-4">
          <RightSideContent />
        </div>
      </div>
    </div>
  );
};

export default Home;
