import { prisma } from "@/config";
import dayjs from "dayjs";

export async function createHotel() {
  const hotel = await prisma.hotel.create({
    data: {
      name: "hotel test",
      image: "linkImagemTop",
      updatedAt: dayjs(Date.now()).toDate(),
  
    }
  });
  
  return hotel; 
}

