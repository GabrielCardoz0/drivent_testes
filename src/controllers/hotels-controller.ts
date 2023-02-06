import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { log } from "console";
import { Response } from "express";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelslist = await hotelsService.getAllHotels();
    
    res.status(200).send(hotelslist);
  } catch (error) {
    log(error);
    res.sendStatus(404);
  } 
}

export async function getHotelsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;

  const userId = req.userId;

  try {
    const id = Number(hotelId);
    const hotel = await hotelsService.getHotelsByHotelId(id, userId);

    res.status(200).send(hotel);
  } catch (error) {
    log(error);
    
    if(error.name === "PaymentRequired") {
      return res.sendStatus(402);
    }

    if(error.name === "NotFoundError") {
      return res.sendStatus(404);
    }

    res.sendStatus(400);
  }
}
