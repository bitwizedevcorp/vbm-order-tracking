import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  const dataToInsert = await req.json();
  console.log("here:", dataToInsert);
  try {
    const dataAvailable = await prisma.tb_recepcion.findFirst({
      where: {
        nropallet: dataToInsert.nropallet_recepcion,
      },
      select: {
        box_disponible: true,
        kg_disponible: true,
        codigo: true,
      },
    });

    console.log("data available", dataAvailable);

    if (dataAvailable) {
      const boxDisponibleFromDb = dataAvailable.box_disponible;
      const kgDisponible = dataAvailable.kg_disponible.toNumber();

      if (kgDisponible !== 0 && boxDisponibleFromDb !== 0) {
        try {
          const updateTbReception = await prisma.tb_recepcion.update({
            where: {
              nropallet: dataToInsert.nropallet_recepcion,
              codigo: dataAvailable.codigo,
            },
            data: {
              box_disponible:
                boxDisponibleFromDb - Number(dataToInsert.numberBaxes),
              kg_disponible: kgDisponible - Number(dataToInsert.kgUsedBaxes),
              state: dataToInsert.state,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    //so for the delivery pallet db is ok
    const insertKgAndBaxexDeliveryPallet =
      await prisma.tb_delivery_pallet.update({
        where: {
          iddelivery: 582,
        },
        data: {
          bax_add: Number(dataToInsert.numberBaxes),
          kg_add: dataToInsert.kgUsedBaxes,
        },
      });

    //deliver reception work:
    const getIdForDeliveryReception =
      await prisma.tb_delivery_reception.findFirst({
        where: {
          idorden: 30,
          idpunnet: 46,
          nropallet_delivery: 2,
          nropallet_recepcion: 113,
        },
        select: {
          id: true,
        },
      });
    console.log("aici", getIdForDeliveryReception?.id);

    if (getIdForDeliveryReception?.id) {
      const insertKgAndBaxexDeliveryReception =
        await prisma.tb_delivery_reception.update({
          where: {
            id: getIdForDeliveryReception?.id,
          },
          data: {
            bax: Number(dataToInsert.numberBaxes),
            kg_used: dataToInsert.kgUsedBaxes,
          },
        });
    }

    return NextResponse.json({ message: "Success", status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error updating data",
        error: error,
      },
      { status: 500 }
    );
  }
}
