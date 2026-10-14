import type { Metadata } from "next";
import ShipmentTracking from "@/components/ShipmentTracking";

export const metadata: Metadata = {
  title: "Sigue tu pedido | MeliFut",
  description: "Consulta el estado de tu envío con tu número de seguimiento.",
};

export default function TrackingPage() {
  return <ShipmentTracking />;
}
