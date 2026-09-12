import { strifeApi } from "./strife-api";

const fileApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<any, File[]>({
      query: (files) => ({
        url: "files",
        method: "POST",
        body: files,
      }),
    }),
  }),
});
