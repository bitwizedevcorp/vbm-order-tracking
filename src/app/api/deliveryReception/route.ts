import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const [idorden, idpunnet] = data.payload.idorden_idpunnet.split("_");
    let insertedIds = [];

    for (const key of data.payload.selectedRows) {
      const insertDb = await prisma.tb_delivery_reception.create({
        data: {
          line: Number(data.payload.workLine),
          idorden: Number(idorden),
          idpunnet: Number(idpunnet),
          nropallet_delivery: Number(data.payload.nrPalletDelivery),
          nropallet_recepcion: Number(data.payload.nropallet_recepcion),
          old_pallet: 1,
          bax: 0,
          kg_used: 0.0,
          started: new Date(),
          finish: new Date("1970-01-01T00:00:00Z"),
          tiempo: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });
      insertedIds.push(insertDb.id);
    }

    return NextResponse.json({
      message: "Success",
      status: 200,
      data: insertedIds[0],
    });
  } catch (err) {
    console.error("Error in POST endpoint:", err);
    return NextResponse.json({ message: "Error", status: 500 });
  }
}
