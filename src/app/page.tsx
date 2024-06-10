import prisma from "../../lib/prisma";

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
    <div>
      <section className="flex items-center justify-center h-screen bg-gray-100 text-center p-4">
        <div>
          <h1 className="text-2xl font-bold">
            Client and destination delivery, day_depature
          </h1>
        </div>
      </section>
      <div></div>
    </div>
  );
};

export default Home;
