import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  try {
    const extractCodigo = await prisma.tb_recepcion.findMany({
      where: {
        nropallet: id,
      },
      select: {
        codigo: true,
      },
    });

    console.log(extractCodigo);

    const res = await prisma.tb_recepcion.update({
      where: {
        nropallet: id,
        codigo: extractCodigo[0].codigo,
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
