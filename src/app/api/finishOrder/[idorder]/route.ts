import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { idOrder: string } }
) {
  const id = params.idOrder;
  try {
    // Fetch all order details for the given order id
    const getAllOrderDetail = await prisma.tb_orden_detail.findMany({
      where: {
        idorden: Number(id),
      },
    });

    if (getAllOrderDetail) {
      // Check if all order details have state 4
      const allDetailsCompleted = getAllOrderDetail.every(
        (orderDetail) => orderDetail.state === 4
      );

      if (allDetailsCompleted) {
        // Update the order state to 4
        await prisma.tb_orden.update({
          where: {
            idorden: Number(id),
          },
          data: {
            state: 4,
          },
        });
      }
    }

    return NextResponse.json(getAllOrderDetail);
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
