import prisma from "../../lib/prisma";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";

const Home = async () => {
  async function getClientFromDbWithState() {
    try {
      const data = await prisma.tb_orden.findMany({
        where: {
          state: 6,
        },
      });

      return data.map((order) => ({
        cliente: order.cliente,
        destino: order.destino,
        fecha_despacho: order.fecha_despacho,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  const data = await getClientFromDbWithState();
  console.log(data);
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
          Right Content
        </div>
      </div>
    </div>
  );
};

export default Home;
