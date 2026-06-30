import { Storage } from "@google-cloud/storage";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { toMediaUrl } from "./media-url";

const BUCKET = process.env.STUDIO_GCS_BUCKET || "aerosports";

function getCreds() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }
  return JSON.parse(
    readFileSync(join(process.cwd(), "src", "app", "api", "sheet", "service-account-creds.json"), "utf8")
  );
}

let storageClient;
function getStorage() {
  if (!storageClient) {
    const creds = getCreds();
    storageClient = new Storage({
      projectId: creds.project_id,
      credentials: {
        client_email: creds.client_email,
        private_key: (creds.private_key || "").replace(/\\n/g, "\n"),
      },
    });
  }
  return storageClient;
}

/**
 * Upload a buffer to the GCS bucket and return its public URL.
 * Requires the service account to have write access (e.g. roles/storage.objectAdmin)
 * on the bucket, and the bucket to allow public reads.
 */
export async function uploadToGcs(buffer, objectPath, contentType = "image/webp") {
  await getStorage()
    .bucket(BUCKET)
    .file(objectPath)
    .save(buffer, {
      contentType,
      resumable: false,
      metadata: { cacheControl: "public, max-age=31536000, immutable" },
    });
  return toMediaUrl(`https://storage.googleapis.com/${BUCKET}/${objectPath}`);
}

export function getBucketName() {
  return BUCKET;
}
