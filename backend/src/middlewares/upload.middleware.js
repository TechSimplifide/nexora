import multer from "multer";

const storage = multer.memoryStorage();

// --------------------------------------------------
// File filters
// --------------------------------------------------

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const projectFileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/webp"];

  const pdfTypes = ["application/pdf"];

  if (file.fieldname === "screenshots") {
    if (imageTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only JPG, PNG, and WEBP images are allowed for screenshots"),
      false,
    );
  }

  if (file.fieldname === "supportingDocument") {
    if (pdfTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only PDF files are allowed for supporting documents"),
      false,
    );
  }

  cb(new Error("Unexpected file field"), false);
};

// --------------------------------------------------
// Multer configurations
// --------------------------------------------------

const proposalUpload = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

const projectUpload = multer({
  storage,
  fileFilter: projectFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
  },
});

// --------------------------------------------------
// Project Proposal
// --------------------------------------------------

export const uploadProposalPdf = proposalUpload.single("abstractPdf");

// --------------------------------------------------
// Project
// --------------------------------------------------

export const uploadProjectFiles = projectUpload.fields([
  {
    name: "screenshots",
    maxCount: 5,
  },
  {
    name: "supportingDocument",
    maxCount: 1,
  },
]);
