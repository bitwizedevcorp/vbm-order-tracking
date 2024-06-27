import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { select } from "@nextui-org/react";

export async function POST(req: Request) {
  const dataToInsert = await req.json();
  console.log(dataToInsert);
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
    const insertKgAndBaxexDeliveryPallet =
      await prisma.tb_delivery_pallet.update({
        where: {
          iddelivery: dataToInsert.idDeliveryClicked,
        },
        data: {
          bax_add: Number(dataToInsert.numberBaxes),
          kg_add: dataToInsert.kgUsedBaxes,
        },
      });

    //   //deliver reception work:
    //   const getIdForDeliveryReception =
    //     await prisma.tb_delivery_reception.findFirst({
    //       where: {
    //         idorden: dataToInsert.idOrder,
    //         idpunnet: dataToInsert.idOrdenDetails,
    //         nropallet_delivery: numberOfPallet?.nrpallet,
    //         nropallet_recepcion: dataToInsert.nropallet_recepcion,
    //       },
    //       select: {
    //         id: true,
    //       },
    //     });

    //   if (getIdForDeliveryReception?.id) {

    let tiempo: any; // Define tiempo as a number or undefined

    const getStartedDate = await prisma.tb_delivery_reception.findUnique({
      where: {
        id: dataToInsert.idCreate,
      },
      select: {
        started: true,
      },
    });

    const finishDate: Date = new Date();

    if (getStartedDate?.started) {
      const startTime = new Date(getStartedDate.started).getTime();
      const endTime = finishDate.getTime();
      const durationInMs = endTime - startTime;

      tiempo = new Date(durationInMs); // Convert duration in milliseconds to a Date object
    } else {
      tiempo = undefined; // Handle the case where started is undefined
    }

    const insertKgAndBaxexDeliveryReception =
      await prisma.tb_delivery_reception.update({
        where: {
          id: dataToInsert.idCreate,
        },
        data: {
          bax: Number(dataToInsert.numberBaxes),
          kg_used: dataToInsert.kgUsedBaxes,
          finish: finishDate,
          tiempo: tiempo,
        },
      });
    // }

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
