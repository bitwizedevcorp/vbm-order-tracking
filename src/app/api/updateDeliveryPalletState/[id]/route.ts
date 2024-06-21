import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    //console.log("intru");
    const res = await prisma.tb_delivery_pallet.update({
      where: {
        iddelivery: id,
      },
      data: {
        state: 2,
      },
    });

    return NextResponse.json({ message: "Succes", status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error fetching data",
        error: error,
      },
      { status: 500 }
    );
  }
}
