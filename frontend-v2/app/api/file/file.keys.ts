import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { deleteFile, getFile, uploadFile } from "./file.requests";
import type {
  DeleteFileMutation,
  UploadFileMutation,
  UploadFileRequest,
} from "./file.types";

export enum FileKeys {
  FILE = "FILE",
  UPLOAD_FILE = "UPLOAD_FILE",
  DELETE_FILE = "DELETE_FILE",
}

function getFileQueryOptions(fileId: string) {
  return queryOptions({
    queryKey: [FileKeys.FILE, fileId],
    queryFn: () => getFile(fileId),
    enabled: !!fileId,
    gcTime: 0,
  });
}

function uploadFileMutationOptions(callbacks?: UploadFileMutation) {
  return mutationOptions({
    mutationKey: [FileKeys.UPLOAD_FILE],
    mutationFn: (request: UploadFileRequest) => uploadFile(request),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

function deleteFileMutationOptions(callbacks?: DeleteFileMutation) {
  return mutationOptions({
    mutationKey: [FileKeys.DELETE_FILE],
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export {
  getFileQueryOptions,
  uploadFileMutationOptions,
  deleteFileMutationOptions,
};
