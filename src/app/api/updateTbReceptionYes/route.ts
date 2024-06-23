import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  const dataToInsert = await req.json();
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
    const numberOfPallet = await prisma.tb_delivery_pallet.findUnique({
      where: {
        iddelivery: dataToInsert.idDeliveryClicked,
      },
      select: {
        nrpallet: true,
      },
    });
    //so for the delivery pallet db is ok
    const insertKgAndBaxexDeliveryPallet =
      await prisma.tb_delivery_pallet.update({
        where: {
          iddelivery: dataToInsert.idDeliveryClicked,
        },
        data: {
          bax_add: Number(dataToInsert.numberBaxes),
          kg_add: dataToInsert.kgUsedBaxes,
          state: 3,
        },
      });

    //deliver reception work:
    const getIdForDeliveryReception =
      await prisma.tb_delivery_reception.findFirst({
        where: {
          idorden: dataToInsert.idOrder,
          idpunnet: dataToInsert.idOrdenDetails,
          nropallet_delivery: numberOfPallet?.nrpallet,
          nropallet_recepcion: dataToInsert.nropallet_recepcion,
        },
        select: {
          id: true,
        },
      });

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
