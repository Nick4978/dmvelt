-- AddForeignKey
ALTER TABLE "Lien" ADD CONSTRAINT "Lien_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
