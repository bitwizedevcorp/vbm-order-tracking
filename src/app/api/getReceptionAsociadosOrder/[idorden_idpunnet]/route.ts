import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { idorden_idpunnet: string } }
) {
  const [idorden, idpunnet] = params.idorden_idpunnet.split("_");
  //fix aici
  try {
    // Fetch the associated orders
    const data = await prisma.tb_reception_asociados_order.findMany({
      where: {
        idorden: Number(idorden),
        idpunnet: Number(idpunnet),
      },
    });

    // Extract pallet numbers from the associated orders
    const ids = data.map((nrPallet) => nrPallet.nropallet_recepcion);

    // Fetch the reception info for the extracted pallet numbers
    const infoFromReception = await prisma.tb_recepcion.findMany({
      where: {
        nropallet: {
          in: ids,
        },
      },
      select: {
        nropallet: true, // Include nropallet to match with the associated orders
        box_disponible: true,
        kg_disponible: true,
      },
    });

    // Create a map for quick lookup of reception info by pallet number
    const receptionInfoMap: {
      [key: string]: { box_disponible: number; kg_disponible: number };
    } = infoFromReception.reduce((acc: { [key: string]: any }, info) => {
      acc[info.nropallet.toString()] = info;
      return acc;
    }, {});

    // Combine the associated orders with the corresponding reception info
    const combinedData = data.map((order) => ({
      ...order,
      box_disponible:
        receptionInfoMap[order.nropallet_recepcion.toString()]
          ?.box_disponible || 0,
      kg_disponible:
        receptionInfoMap[order.nropallet_recepcion.toString()]?.kg_disponible ||
        0,
    }));

    //console.log(combinedData);

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      {
        message: "Error fetching data",
        error: error,
      },
      { status: 500 }
    );
  }
}
