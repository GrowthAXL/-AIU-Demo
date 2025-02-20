// Import required modules
import fs from "fs";
import path from "path";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import {
  createCertificate,
  generateNonceAndHash,
  makeHashTransaction,
} from "./blockchain-utils";
import mongoose from "mongoose";
import { CertificateModel } from "./certificate-modal";
import { MONGO_URI } from "./config";
import { data } from "./data";
import { Certificate } from "./data";
import { FileUploadService } from "./file-upload-service";

const CERTIFICATE_DIR = path.join(__dirname, "../certificates");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // This enables parsing of x-www-form-urlencoded data

app.set("view engine", "ejs");

// DB connection
// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// initialize file uploader
const fileUploadService = new FileUploadService("azure");

// Define routes
// app.get("/", async (req: Request, res: Response) => {
//   const { nonce, hash } = generateNonceAndHash("name", "sport");
//   const txid = await makeHashTransaction(hash);
//   res.json({
//     message: "Welcome to the Express server!",
//     txid: txid,
//     nonce,
//     hash,
//   });
// });

// Serve the EJS page
app.get("/", (req, res) => {
  res.render("index", { txnId: null, error: null });
});

// Handle form submission
app.post("/search", async (req, res) => {
  const { aadhar_number } = req.body;

  try {
    const certificate = await CertificateModel.findOne({ aadhar_number });

    if (!certificate) {
      return res.render("index", { txnId: null, error: "Invalid data" });
    }

    // Generate a presigned URL for the certificate file
    const presignedUrl = await fileUploadService.generatePresignedUrl({
      fileId: certificate.resource_id,
      fileName: certificate.resource_id,
      folderName: "AIU",
      expiresIn: 60,
    });

    res.render("index", { txnId: certificate.txid, error: null, presignedUrl });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.render("index", { txnId: null, error: "Error processing request" });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  //   await generateTransactionHashes();
});

const generateTransactionHashes = async () => {
  console.log(
    "AB NO-18813 >>>",
    await createCertificate(
      "PREETI",
      "100 METERS",
      "CHANDIGARH UNIVERSITY,MOHALI",
      "ATHLETICS",
      "RUNNERS UP",
      "ATHLETICS",
      "KIIT Deemed to be University",
      "17-12-2023",
      "29-12-2023",
      "AB NO-18813"
    )
  );
  console.log(
    "AA NO-18631 >>>",
    await createCertificate(
      "KUSUM THAKUR",
      "200 METERS",
      "HIMACHAL PRADESH UNIVERSITY",
      "ATHLETICS",
      "Winner",
      "ATHLETICS",
      "KIIT Deemed to be University",
      "17-12-2023",
      "29-12-2023",
      "AA NO-18631"
    )
  );
  console.log(
    "AB NO-18814 >>>",
    await createCertificate(
      "RASHDEEP KAUR",
      "200 METERS",
      "CHANDIGARH UNIVERSITY,MOHALI",
      "ATHLETICS",
      "RUNNERS UP",
      "ATHLETICS",
      "KIIT Deemed to be University",
      "17-12-2023",
      "29-12-2023",
      "AB NO-18814"
    )
  );
  console.log(
    "AA NO-18633 >>>",
    await createCertificate(
      "GUG KAUR",
      "400 METERS",
      "CHANDIGARH UNIVERSITY,MOHALI",
      "ATHLETICS",
      "RUNNERS UP",
      "ATHLETICS",
      "KIIT Deemed to be University",
      "17-12-2023",
      "29-12-2023",
      "AA NO-18633"
    )
  );
  console.log(
    "AC NO-20983 >>>",
    await createCertificate(
      "SHIVANI GAIKWAD",
      "400 METERS",
      "MANGALORE UNIVERSITY",
      "ATHLETICS",
      "3rd Position",
      "ATHLETICS",
      "KIIT Deemed to be University",
      "17-12-2023",
      "29-12-2023",
      "AC NO-20983"
    )
  );
  console.log(
    "AA19230 >>>",
    await createCertificate(
      "TANEESHA SINGH",
      "Badminton",
      "ADAMAS UNIVERSITY, KOLKATA, WEST BANGAL",
      "Badminton",
      "Winner",
      "Badminton",
      "SRMIST, KATTANKULATHUR, TAMILNADU",
      "07-01-2024",
      "10-01-2024",
      "AA19230"
    )
  );
  console.log(
    "AB18032 >>>",
    await createCertificate(
      "SAKSHI GAHLAWAT",
      "Badminton",
      "SHRI JAGDISHPRASAD JHABARMAL TIBREWALA UNIVERSITY, RAJASHTAN",
      "Badminton",
      "Runners up",
      "Badminton",
      "SRMIST, KATTANKULATHUR, TAMILNADU",
      "07-01-2024",
      "10-01-2024",
      "AB18032"
    )
  );
  console.log(
    "AB18030 >>>",
    await createCertificate(
      "DEEPSHIKHA SINGH",
      "Badminton",
      "SHRI JAGDISHPRASAD JHABARMAL TIBREWALA UNIVERSITY, RAJASHTAN",
      "Badminton",
      "Runners up",
      "Badminton",
      "SRMIST, KATTANKULATHUR, TAMILNADU",
      "07-01-2024",
      "10-01-2024",
      "AB18030"
    )
  );
  console.log(
    "AC20363 >>>",
    await createCertificate(
      "TANYA HEMANTH",
      "Badminton",
      "JAIN UNIVERSITY, BENGALORE, KARNATAKA",
      "Badminton",
      "3rd Position",
      "Badminton",
      "SRMIST, KATTANKULATHUR, TAMILNADU",
      "07-01-2024",
      "10-01-2024",
      "AC20363"
    )
  );
  console.log(
    "AC20366 >>>",
    await createCertificate(
      "ANANYA PRAVEEN",
      "Badminton",
      "JAIN UNIVERSITY, BENGALORE, KARNATAKA",
      "Badminton",
      "3rd Position",
      "Badminton",
      "SRMIST, KATTANKULATHUR, TAMILNADU",
      "07-01-2024",
      "10-01-2024",
      "AC20366"
    )
  );
};

const insertCertificates = async (certificatesData: Certificate[]) => {
  try {
    for (const data of certificatesData) {
      // Check if certificate with the same certificate_number already exists
      const existingCertificate = await CertificateModel.findOne({
        certificate_number: data.certificate_number,
      });

      if (!existingCertificate) {
        await CertificateModel.create(data);
        console.log(`Inserted: ${data.certificate_number}`);
      } else {
        console.log(`Skipped (Already Exists): ${data.certificate_number}`);
      }
    }
    console.log("Certificate insertion process completed.");
  } catch (error) {
    console.error("Error inserting certificates:", error);
  }
};

const processCertificates = async () => {
  try {
    // Fetch certificates missing resource_id
    const certificates = await CertificateModel.find({
      resource_id: { $in: [null, ""] },
    });

    if (certificates.length === 0) {
      console.log("No certificates require processing.");
      return;
    } else {
      console.log("Some certificates require processing.");
    }

    for (const cert of certificates) {
      const pdfFilename = `${cert.certificate_number}.pdf`; // Assuming the file name is based on certificate_number
      const filePath = path.join(CERTIFICATE_DIR, pdfFilename);

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        console.warn(
          `File not found for certificate: ${cert.certificate_number}`
        );
        continue;
      }

      console.log(`Uploading file: ${pdfFilename}`);

      // Upload the file and get the file ID
      try {
        // Generate UUID for the user certificate
        const uniqueId = uuidv4();

        // upload certificate to the cloud bucket
        const uploadData = await fileUploadService.uploadFile({
          folderName: "AIU",
          fileName: uniqueId,
          filePath: filePath,
          fileMetadata: {
            mimetype: "application/pdf",
          },
        });
        if (uploadData) {
          console.log(uploadData, "+++++");

          //  Update the certificate with the new resource_id
          await CertificateModel.updateOne(
            { _id: cert._id },
            { $set: { resource_id: uniqueId } }
          );
          console.log(
            `Updated certificate ${cert.certificate_number} with resource_id: ${uniqueId}`
          );
        }
      } catch (uploadError) {
        console.error(`Error uploading ${pdfFilename}:`, uploadError);
      }
    }

    console.log("Certificate processing completed.");
  } catch (error) {
    console.error("Error processing certificates:", error);
  }
};

(async () => {
  await insertCertificates(data);
})();
