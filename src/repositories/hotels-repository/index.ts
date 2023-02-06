import { prisma } from "@/config";

async function getAllHotels() {
  const hotelsList = await prisma.hotel.findMany();
  
  return hotelsList;
}

async function getHotelsByHotelId(id: number) {
  const hotel = await prisma.hotel.findFirst({
    where: {
      id
    },
    include: {
      Rooms: true
    }
  });

  return hotel;
}

const hotelsRepository = {
  getAllHotels,
  getHotelsByHotelId
};

export default hotelsRepository;
