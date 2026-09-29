import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteFileMutationOptions,
  getFileQueryOptions,
  uploadFileMutationOptions,
} from "./file.keys";

export function useFileQuery(fileId: string) {
  return useQuery(getFileQueryOptions(fileId));
}

export function useUploadFileMutation() {
  const onError = (error: unknown) => {
    console.error("Failed to upload file:", error);
  };

  return useMutation(uploadFileMutationOptions({ onError }));
}

export function useDeleteFileMutation() {
  const queryClient = useQueryClient();

  const onError = (error: unknown) => {
    console.error("Failed to delete file:", error);
  };

  return useMutation({
    ...deleteFileMutationOptions({ onError }),
    onSuccess: (_data, fileId) => {
      queryClient.removeQueries({
        queryKey: getFileQueryOptions(fileId).queryKey,
      });
    },
  });
}
