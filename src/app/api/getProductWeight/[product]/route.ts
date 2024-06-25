import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { product: any } }
) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const product = params.product;

  try {
    const orderDetail = await prisma.tb_product.findFirst({
      where: {
        idproduct: Number(product),
      },
      select: {
        weight: true,
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
