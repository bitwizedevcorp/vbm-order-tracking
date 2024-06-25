import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { idorder: string } }
) {
  const id = params.idorder;
  try {
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        {
          message: "Invalid order ID",
        },
        { status: 400 }
      );
    }

    const getAllOrderDetail = await prisma.tb_orden_detail.findMany({
      where: {
        idorden: Number(id),
      },
    });

    if (getAllOrderDetail.length === 0) {
      return NextResponse.json(
        {
          message: "Order details not found",
        },
        { status: 404 }
      );
    }

    const allDetailsCompleted = getAllOrderDetail.every(
      (orderDetail) => orderDetail.state === 4
    );

    if (allDetailsCompleted) {
      await prisma.tb_orden.update({
        where: {
          idorden: Number(id),
        },
        data: {
          state: 4,
        },
      });
      return NextResponse.json({ message: "Success" }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          message: "Not all order details are completed",
        },
        { status: 403 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error,
      },
      { status: 500 }
    );
  }
}
