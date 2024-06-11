import prisma from "../../lib/prisma";

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
      <div className="w-40 overflow-y-auto bg-gray-200">
        {/* Left part */}
        <div className="h-full">
          {/* Content that needs to be scrollable */}
          {/* Add your content here */}
          <h1>Order 1</h1>
          <h1>Order 2</h1>
        </div>
      </div>
      <div className="flex-1 bg-gray-300">
        {/* Right part */}
        {/* Content for the right part */}
        {/* Add your content here */}
        <h1>
          <input type="text" disabled value="Detail 1" /> <br></br>
          <input type="text" disabled value="Detail 2" />
        </h1>
      </div>
    </div>
  );
};

export default Home;
