import { api } from "../api";
import type { StrifeFile, UploadFileRequest } from "./file.types";

async function uploadFile({
  file,
  channelId,
}: UploadFileRequest): Promise<StrifeFile> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<StrifeFile>("/files/upload", formData, {
    params: channelId ? { channelId } : undefined,
  });
  return data;
}

async function getFile(fileId: string): Promise<Blob> {
  const { data } = await api.get<Blob>(`/files/${fileId}`, {
    responseType: "blob",
  });
  return data;
}

async function deleteFile(fileId: string): Promise<void> {
  await api.delete(`/files/${fileId}`);
}

export { uploadFile, getFile, deleteFile };
