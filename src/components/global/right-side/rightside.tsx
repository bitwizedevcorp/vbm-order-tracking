import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  CardFooter,
  Input,
} from "@nextui-org/react";

const RightSideContent = () => {
  return (
    <Card className="max-w-[600px]">
      <CardHeader className="flex gap-3">
        <b>Order details</b>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex mb-4">
          <div className="w-3/12 flex items-center">
            <b>Client</b>
          </div>
          <div className="w-9/12">
            <Input type="text" value="Lidl" readOnly name="client" />
          </div>
        </div>

        <div className="flex mb-4">
          <div className="w-3/12 flex items-center">
            <b>Destination</b>
          </div>
          <div className="w-9/12">
            <Input type="text" value="Bucharest" readOnly name="destination" />
          </div>
        </div>

        <div className="flex mb-4">
          <div className="w-3/12 flex items-center">
            <b>Day of departure</b>
          </div>
          <div className="w-9/12">
            <Input
              type="text"
              value="12/03/2023"
              readOnly
              name="day_of_departure"
            />
          </div>
        </div>

        <div className="flex mb-4">
          <div className="w-3/12 flex items-center">
            <b>Idorden</b>
          </div>
          <div className="w-9/12">
            <Input type="text" value="1883" readOnly name="idorden" />
          </div>
        </div>

        <div className="flex mb-4">
          <div className="w-3/12 flex items-center">
            <b>Punnet</b>
          </div>
          <div className="w-9/12">
            <Input type="text" value="200" readOnly name="punnet" />
          </div>
        </div>

        <div className="flex mb-4">
          <div className="w-3/12 flex items-center">
            <b>Carton bay</b>
          </div>
          <div className="w-9/12">
            <Input type="text" value="12" readOnly name="carton_bay" />
          </div>
        </div>

        <div className="flex mb-4">
          <div className="w-3/12 flex items-center">
            <b>Number pallet</b>
          </div>
          <div className="w-9/12">
            <Input type="text" value="12.3" readOnly name="number_pallet" />
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  );
};

export default RightSideContent;
