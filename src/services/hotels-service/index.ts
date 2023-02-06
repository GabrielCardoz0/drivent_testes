import hotelsRepository from "@/repositories/hotels-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getAllHotels() {
  const hotelsList = await hotelsRepository.getAllHotels();

  return hotelsList;
}

async function getHotelsByHotelId(id: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);  

  if(!enrollment) {
    throw  { name: "NotFoundError", message: "Enrollment deu ruim" };
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if(ticket) {
    throw { name: "NotFoundError", message: "Ticket deu ruim" };
  }

  const ticketype = await ticketRepository.findTickeWithTypeById(ticket.id);

  if(ticket.status !== "PAID" || ticketype.TicketType.isRemote || !ticketype.TicketType.includesHotel) {
    throw {
      name: "PaymentRequired",
      message: "Payment must be required!",
    };
  }
  
  const hotel = await hotelsRepository.getHotelsByHotelId(id);
  
  if(!hotel) {
    throw { name: "NotFoundError", message: "Hotel não encontrado deu ruim" };
  }

  return hotel;
}

const hotelsService = {
  getAllHotels,
  getHotelsByHotelId
};

export default hotelsService;
