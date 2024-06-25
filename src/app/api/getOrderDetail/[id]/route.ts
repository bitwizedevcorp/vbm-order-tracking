import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: { id: any } }) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
  const idorden = params.id;

  try {
    const orderDetail = await prisma.tb_orden_detail.findMany({
      where: {
        idorden: Number(idorden),
      },
    });

    return NextResponse.json({
      message: "Your order detail",
      orderDetail: orderDetail,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
