"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const faker_1 = require("@faker-js/faker");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
async function main() {
    const commonPassword = "password123";
    const hashedPassword = await bcrypt_1.default.hash(commonPassword, 10);
    // Create a global admin user
    console.log(`Creating admin user...`);
    const user = await prisma.user.create({
        data: {
            name: "Global Admin",
            email: "admin@example.com",
            password: hashedPassword,
            isGlobalAdmin: true,
            address: faker_1.faker.location.streetAddress(),
            city: faker_1.faker.location.city(),
            state: faker_1.faker.location.state({ abbreviated: true }),
            zipCode: faker_1.faker.location.zipCode(),
            phone: faker_1.faker.phone.number(),
            isLocalAdmin: false,
        },
    });
    console.log(`Created user ${user.name} with email ${user.email}`);
    for (let i = 0; i < 2500; i++) {
        try {
            const dealer = await prisma.dealer.create({
                data: {
                    name: faker_1.faker.company.name(),
                    address: faker_1.faker.location.streetAddress(),
                    city: faker_1.faker.location.city(),
                    state: faker_1.faker.location.state({ abbreviated: true }),
                    zipCode: faker_1.faker.location.zipCode(),
                    phone: faker_1.faker.phone.number(),
                    email: faker_1.faker.internet.email(),
                    lienHolderId: (0, uuid_1.v4)(),
                    users: {
                        create: [
                            {
                                user: {
                                    create: {
                                        name: faker_1.faker.person.fullName(),
                                        email: faker_1.faker.internet.email(),
                                        password: hashedPassword,
                                        isLocalAdmin: false,
                                        address: faker_1.faker.location.streetAddress(),
                                        city: faker_1.faker.location.city(),
                                        state: faker_1.faker.location.state({ abbreviated: true }),
                                        zipCode: faker_1.faker.location.zipCode(),
                                        phone: faker_1.faker.phone.number(),
                                    },
                                },
                            },
                        ],
                    },
                },
            });
        }
        catch (err) {
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
                vin: faker_1.faker.vehicle.vin(),
                make: faker_1.faker.vehicle.manufacturer(),
                model: faker_1.faker.vehicle.model(),
                year: faker_1.faker.number.int({ min: 2000, max: 2023 }),
                color: faker_1.faker.color.human(),
                mileage: faker_1.faker.number.int({ min: 10000, max: 150000 }),
            },
        });
        vehicles.push(vehicle);
    }
    for (let i = 0; i < 10000; i++) {
        const dealer = faker_1.faker.helpers.arrayElement(allDealers);
        const vehicle = faker_1.faker.helpers.arrayElement(vehicles);
        try {
            await prisma.lien.create({
                data: {
                    dealerId: dealer.id,
                    vehicleId: vehicle.id,
                    rank: faker_1.faker.number.int({ min: 1, max: 3 }),
                    status: faker_1.faker.number.int({ min: 0, max: 3 }),
                    lienholder: dealer.name,
                    readFlag: faker_1.faker.datatype.boolean(),
                },
            });
        }
        catch (err) {
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
