import app, { init } from "@/app";
import { TicketStatus } from "@prisma/client";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createTicket, createTicketType, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", async () => {
  it("should respond with status 401 if no token", async () => {
    const result = await server.get("/hotels");

    expect(result.status).toBe(401);
  });

  it("should respond with status 401 if invalid token", async () => {
    const result = await server.get("/hotels").set("Authorization", "Bearer XXXX");

    expect(result.status).toBe(401);
  });

  it("should respond with status 401 if no enrollment", async () => {
    const user = await createUser();

    const token = generateValidToken(user);

    const result = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(401);
  });

  it("Should respond with status 200 and list of hotels if erollment, paid, presencial, have hotel", async () => {
    await cleanDb();
    
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const result = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);

    expect(result.body).toEqual([]);
  });
});

describe("GET /hotels/hotelId", async () => {
  it("should respond with statys 401 if no token", async () => {
    const result = await server.get("/hotels/1").set("Authorization", "Bearer ");

    expect(result.status).toBe(401);
  });

  it("should respond with status 200 when hotelId is invalid", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const result = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });

  it("should respond with status 200 when hotelId is invalid", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    await createHotel();

    const result = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });
});
