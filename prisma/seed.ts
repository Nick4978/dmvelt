import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  const commonPassword = "password123";
  const hashedPassword = await bcrypt.hash(commonPassword, 10);

  // Create a global admin user
  console.log(`Creating admin user...`);
  const user = await prisma.user.create({
    data: {
      name: "Global Admin",
      email: "admin@example.com",
      password: hashedPassword,
      isGlobalAdmin: true,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      phone: faker.phone.number(),
      isLocalAdmin: false,
    },
  });
  console.log(`Created user ${user.name} with email ${user.email}`);

  for (let i = 0; i < 2500; i++) {
    try {
      const dealer = await prisma.dealer.create({
        data: {
          name: faker.company.name(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zipCode: faker.location.zipCode(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
          lienHolderId: uuidv4(),
          users: {
            create: [
              {
                user: {
                  create: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: hashedPassword,
                    isLocalAdmin: false,
                    address: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state({ abbreviated: true }),
                    zipCode: faker.location.zipCode(),
                    phone: faker.phone.number(),
                  },
                },
              },
            ],
          },
        },
      });
    } catch (err) {
      // skip duplicates if same dealer name is already used
      console.error(`Error creating dealer: ${err}`);
      continue;
    }
  }

  const allDealers = await prisma.dealer.findMany();

  const vehicles = [];
  for (let i = 0; i < 10000; i++) {
    const vehicle = await prisma.vehicle.create({
      data: {
        vin: faker.vehicle.vin(),
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2000, max: 2023 }),
        color: faker.color.human(),
        mileage: faker.number.int({ min: 10000, max: 150000 }),
      },
    });
    vehicles.push(vehicle);
  }

  for (let i = 0; i < 10000; i++) {
    const dealer = faker.helpers.arrayElement(allDealers);
    const vehicle = faker.helpers.arrayElement(vehicles);
    try {
      await prisma.lien.create({
        data: {
          dealerId: dealer.id,
          vehicleId: vehicle.id,
          rank: faker.number.int({ min: 1, max: 3 }),
          status: faker.number.int({ min: 0, max: 3 }),
          lienholder: dealer.name,
          readFlag: faker.datatype.boolean(),
        },
      });
    } catch (err) {
      // skip duplicates if same dealer/vehicle combo is already used
      continue;
    }
  }
}

main()
  .then(() => console.log("✅ Updated seed complete"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
