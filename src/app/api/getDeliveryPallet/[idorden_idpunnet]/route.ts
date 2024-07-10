import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { idorden_idpunnet: string } }
) {
  const [idorden, idpunnet] = params.idorden_idpunnet.split("_");
  try {
    let data = await prisma.tb_delivery_pallet.findMany({
      where: {
        idorden: Number(idorden),
        idpunnet_orden: Number(idpunnet),
      },
    });
    // console.log(data);

    const nrpalletValues = data.map(delivery => delivery.nrpallet);

    try {
      let lines = await prisma.tb_delivery_reception.findMany({
        where: {
          idorden: Number(idorden),
          idpunnet: Number(idpunnet),
          nropallet_delivery: {
            in: nrpalletValues
          }
        },
        select: {
          line: true,
          nropallet_delivery: true,
        }
      })

      // Filter multiple entries
      const lastOccurrenceMap = new Map();
      // Iterate over the deliveries array and update the map with the index of the last occurrence
      lines.forEach((delivery, index) => {
        lastOccurrenceMap.set(delivery.nropallet_delivery, index);
      });
    
      // Create a new array with only the last occurrence of each nropallet_delivery
      const filteredDeliveries: any = [];
      lastOccurrenceMap.forEach((index) => {
        filteredDeliveries.push(lines[index]);
      });

      // Add lines in original object
      // Create a map to store line information based on nropallet_delivery
      const lineMap = new Map();
      lines.forEach(lineObj => {
        lineMap.set(lineObj.nropallet_delivery, lineObj.line);
      });

      // Add the line attribute to the deliveries array
      const modifiedDeliveries = data.map(delivery => {
        const line = lineMap.get(delivery.nrpallet);
        return { ...delivery, line: line !== undefined ? line : "N/A" };
      });

      // console.log("Lines", modifiedDeliveries);
      // return NextResponse.json(modifiedDeliveries);
      data = modifiedDeliveries;
    } catch (error) {
      console.log("Cannot do something with lines", error);
    }

    // // In case first try catch fails
    // data = data.map((item: any) => ({
    //   ...item,
    //   ...{line: "N/A"},
    // }));

    return NextResponse.json(data);
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
