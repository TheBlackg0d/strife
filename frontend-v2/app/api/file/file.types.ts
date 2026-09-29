import type { MutationFunc } from "~/shared/types";

export type StrifeFile = {
  id: string;
  url: string;
  originalName: string | null;
  contentType: string | null;
  ownerId: string;
  channelId: string | null;
};

export type UploadFileRequest = {
  file: File;
  channelId?: string;
};

export type MediaRequest = {
  fileId: string;
  contentType: string | null;
  originalName: string | null;
};

export type UploadFileMutation = MutationFunc<StrifeFile>;

export type DeleteFileMutation = MutationFunc<void>;
