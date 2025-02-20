import {
  AZURE_CONTAINER_NAME,
  AZURE_ACCOUNT_NAME,
  AZURE_ACCOUNT_KEY,
} from "./config";

// azure
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  SASProtocol,
  BlobSASPermissions,
} from "@azure/storage-blob";

class blobStorageFileUpload {
  private blobClient;

  constructor() {
    const storageAccountBaseUrl = `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net`;

    const sharedKeyCredential = new StorageSharedKeyCredential(
      AZURE_ACCOUNT_NAME,
      AZURE_ACCOUNT_KEY
    );

    this.blobClient = new BlobServiceClient(
      storageAccountBaseUrl,
      sharedKeyCredential
    );
  }

  uploadFile = async ({ folderName, fileName, filePath, fileMetadata }) => {
    // retrieve the existing container
    const containerClient = await this.blobClient.getContainerClient(
      AZURE_CONTAINER_NAME
    );

    // Create blob client for the specific file location
    const blockBlobClient = await containerClient.getBlockBlobClient(
      `${folderName}/${fileName}`
    );

    // add metadata to file before uploading
    let uploadOptions = {
      blobHTTPHeaders: {},
      // blockSize: 1000,
      // metadata: { RetentionDays: "90" },
      // tags: { project: 'xyz', owner: 'accounts-payable' }
    };

    if (fileMetadata.size) {
      uploadOptions["blockSize"] = fileMetadata.size;
    }
    if (fileMetadata.metadata) {
      uploadOptions["metadata"] = fileMetadata.metadata;
    }
    if (fileMetadata.tags) {
      uploadOptions["tags"] = fileMetadata.tags;
    }
    if (fileMetadata.mimetype) {
      uploadOptions.blobHTTPHeaders["blobContentType"] = fileMetadata.mimetype;
    }
    if (fileMetadata.encoding) {
      uploadOptions.blobHTTPHeaders["blobContentEncoding"] =
        fileMetadata.encoding;
    }

    // upload file to blob storage
    return await blockBlobClient.uploadFile(filePath, uploadOptions);
  };

  deleteFile = async ({ folderName, fileName }) => {
    // retrieve the existing container
    const containerClient = await this.blobClient.getContainerClient(
      AZURE_CONTAINER_NAME
    );

    // Create blob client for the specific file location
    const blockBlobClient = await containerClient.getBlockBlobClient(
      `${folderName}/${fileName}`
    );

    // Invoke delete function from the blobClient object to delete the particular blob.
    return await blockBlobClient.delete();
  };

  getResourceLink = ({ folderName, fileName }) => {
    const url = `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${folderName}/${fileName}`;
    return url;
  };

  generatePresignedUrl = async ({ folderName, fileName, expiresIn = 3600 }) => {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      AZURE_ACCOUNT_NAME,
      AZURE_ACCOUNT_KEY
    );

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: AZURE_CONTAINER_NAME,
        blobName: `${folderName}/${fileName}`,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + expiresIn * 1000),
        protocol: SASProtocol.Https,
      },
      sharedKeyCredential
    ).toString();

    return `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${folderName}/${fileName}?${sasToken}`;
  };

  uploadFileAndGeneratePresignedUrl = async ({
    folderName,
    fileName,
    filePath,
    expiresIn = 3600,
  }) => {
    await this.uploadFile({ folderName, fileName, filePath, fileMetadata: {} });
    return await this.generatePresignedUrl({ folderName, fileName, expiresIn });
  };
}

export class FileUploadService {
  public platform;
  public client;

  constructor(platform: string) {
    this.platform = platform;

    switch (platform.toUpperCase()) {
      case "AZURE":
        this.client = new blobStorageFileUpload();
        break;
      default:
        throw new Error("Unsupported platform!");
    }
  }

  uploadFile = async ({
    folderName,
    fileName,
    filePath,
    file,
    fileMetadata,
  }: {
    folderName: string;
    fileName: string;
    filePath?: string;
    file?: File;
    fileMetadata?: { [key: string]: string };
  }) => {
    return await this.client.uploadFile({
      folderName,
      fileName,
      filePath,
      fileMetadata,
    });
  };

  deleteFile = async ({ folderName, fileName, fileId }) => {
    return await this.client.deleteFile({
      folderName,
      fileName,
    });
  };

  getResourceLink = async ({ folderName, fileName, fileId }) => {
    return await this.client.getResourceLink({
      folderName,
      fileName,
    });
  };

  generatePresignedUrl = async ({
    folderName,
    fileName,
    fileId,
    expiresIn,
  }) => {
    return await this.client.generatePresignedUrl({
      folderName,
      fileName,
      expiresIn,
    });
  };
}
