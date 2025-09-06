// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  formFieldUpload: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
    blob: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => {
      // your auth logic here
      // throw new UploadThingError("Unauthorized") if needed
      return {};
    })
    .onUploadComplete(({ file }) => {
      console.log("Upload complete")
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
