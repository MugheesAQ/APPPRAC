import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Emptying database tables...");
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.statusLog.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Seeding available Government Services...");
  const srv1 = await prisma.service.create({
    data: {
      code: "ICA-101",
      name: "Biometric Passport Renewal Application",
      department: "Immigration & Checkpoints",
      description: "Apply for or renew your biometric citizen passport. Requires a clean high-resolution digital photo and proof of citizenship.",
      requirements: ["Recent digital passport photograph (JPEG)", "Current expiring passport details", "Digital signature of applicant"],
      estimatedDays: 5,
      fee: 80.0,
      popularity: 350,
    },
  });

  const srv2 = await prisma.service.create({
    data: {
      code: "ACRA-202",
      name: "Local Business Incorporation (BizFile+)",
      department: "Corporate Regulatory Authority",
      description: "Register a sole proprietorship, partnership, or private limited company instantly, including automated tax profile deployment.",
      requirements: ["Proposed Business Name", "Description of primary commercial activities", "Identification papers of directors & shareholders"],
      estimatedDays: 2,
      fee: 315.0,
      popularity: 280,
    },
  });

  const srv3 = await prisma.service.create({
    data: {
      code: "LTA-303",
      name: "Digital Driving License Conversion & Issuance",
      department: "Land Transport Authority",
      description: "Convert an overseas driving license or request a new digital smart driving license. Integrated directly with your digital profile.",
      requirements: ["Proof of driving theory test pass/foreign license translation", "Medical physical checkup report certificate", "Eye-sight report"],
      estimatedDays: 3,
      fee: 50.0,
      popularity: 190,
    },
  });

  console.log("Seeding security hashed Users: Citizens and Officers...");
  const citizenPasswordHash = await bcrypt.hash("citizen123", 10);
  const officerPasswordHash = await bcrypt.hash("admin123", 10);

  const citizenUser = await prisma.user.create({
    data: {
      email: "citizen@gov.sg",
      password: citizenPasswordHash,
      name: "Jonathan Tan",
      role: Role.Citizen,
      phone: "+65 9123 4567",
      nric: "S9584732A",
      address: "Block 124 Ang Mo Kio Ave 3, #12-302, Singapore 560124",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
    },
  });

  const officerUser = await prisma.user.create({
    data: {
      email: "admin@gov.sg",
      password: officerPasswordHash,
      name: "Administrator (GovTech)",
      role: Role.Admin,
      phone: "+65 6888 8888",
      nric: "S8049382F",
      address: "GovTech Hive, 10 Pasir Panjang Rd, Singapore 117438",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop",
    },
  });

  console.log("Seeding initial Applications tracking flow logs...");
  const app = await prisma.application.create({
    data: {
      serviceId: srv1.id,
      citizenId: citizenUser.id,
      status: "Processing",
      formData: {
        applicant_name: "Jonathan Tan",
        expiry_date: "2026-12-15",
        photo_attached: "portrait_shot.jpg",
      },
      remarks: "Assigned to ICA Officer Tan. Photographic dimensions approved, printing line scheduled.",
      documents: {
        create: [
          {
            name: "portrait_shot.jpg",
            type: "image/jpeg",
            url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
          },
        ],
      },
      statusLogs: {
        create: [
          { status: "Submitted", remarks: "Application sent through automated biometric submission terminal ICA." },
          { status: "Under_Review", remarks: "NRIC verification and security check completed with no conflicts." },
          { status: "Processing", remarks: "Assigned to ICA Officer Tan. Photographic dimensions approved, printing line scheduled." },
        ],
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: citizenUser.id,
      title: "Passport Renewal Underway",
      message: `Your citizen biometric request under identifier ${app.id} is now 'Processing' with printing scheduled.`,
      type: "success",
    },
  });

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
