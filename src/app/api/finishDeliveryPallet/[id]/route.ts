import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { iddelivery: string } }
) {
  const id = params.iddelivery;
  console.log(params.iddelivery);
  try {
    const data = await prisma.tb_delivery_pallet.update({
      where: {
        iddelivery: Number(id),
      },
      data: {
        state: 4,
      },
    });

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
