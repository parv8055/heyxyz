import prisma from "../client";
import seedPermissions from "./seedPermissions";
import seedPreferences from "./seedPreferences";
import seedProfilePermission from "./seedProfilePermission";

async function main() {
  const preferences = await seedPreferences();
  console.log(`Seeded ${preferences} preferences`);

  const permissions = await seedPermissions();
  console.log(`Seeded ${permissions} permissions`);

  const profilePermissions = await seedProfilePermission();
  console.log(`Seeded ${profilePermissions} profile permissions`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });