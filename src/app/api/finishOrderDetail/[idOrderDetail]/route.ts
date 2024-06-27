import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { idOrderDetail: string } }
) {
  const id = params.idOrderDetail;
  console.log(id);
  try {
    const updateStateOfOrderDetail = await prisma.tb_orden_detail.update({
      where: {
        id: Number(id),
      },
      data: {
        state: 4,
      },
    });

    return NextResponse.json(updateStateOfOrderDetail);
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
