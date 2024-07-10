import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: any) {
  try {
    const dataToInsert = await req.json();
    console.log("data", dataToInsert);

    // Insert new record into tb_storage_packing
    const newRecord = await prisma.tb_storage_packing.create({
      data: {
        fecha: new Date(dataToInsert.fecha),
        idproduct: parseInt(dataToInsert.idproduct),
        tipo: parseInt(dataToInsert.tipo),
        quantity: parseInt(dataToInsert.quantity),
      },
    });

    console.log(newRecord);

    return NextResponse.json({ message: "Success", status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error inserting data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
