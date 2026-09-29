import type { StrifeFile } from "@/types/file";
import { strifeApi } from "./strife-api";

const fileApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<StrifeFile, FormData>({
      query: (files) => ({
        url: "files/upload",
        method: "POST",
        body: files,
      }),
    }),
    getFile: builder.query<Blob, string>({
      query: (fileId) => ({
        url: `files/${fileId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      keepUnusedDataFor: 0,
    }),
    deleteFile: builder.mutation<void, string>({
      query: (fileId) => ({
        url: `files/${fileId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUploadFileMutation,
  useDeleteFileMutation,
  useGetFileQuery,
  useLazyGetFileQuery,
} = fileApi;
