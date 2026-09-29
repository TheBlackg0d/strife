import { useRef, useState } from "react";
import type { FilePond } from "react-filepond";
import type { FilePondFile } from "filepond";
import type { StrifeFile } from "~/api/file/file.types";
import type { MediaRequest } from "~/api/file/file.types";
import { useUploadFileMutation } from "~/api/file/file.hooks";

export function useMessageAttachments(channelId: string) {
  const [files, setFiles] = useState<FilePondFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, StrifeFile>
  >({});
  const pondRef = useRef<FilePond>(null);

  const uploadFileMutation = useUploadFileMutation();

  const hasAttachments = files.length > 0;

  const media: MediaRequest[] = files
    .map((item) => uploadedFiles[item.id])
    .filter((file): file is StrifeFile => Boolean(file))
    .map(({ id, contentType, originalName }) => ({
      fileId: id,
      contentType,
      originalName,
    }));

  const openFileExplorer = () => {
    pondRef.current?.browse();
  };

  const handleAddFile = async (file: FilePondFile) => {
    try {
      const uploaded = await uploadFileMutation.mutateAsync({
        file: file.file as File,
        channelId,
      });

      setUploadedFiles((current) => ({ ...current, [file.id]: uploaded }));

      return uploaded;
    } catch (error) {
      pondRef.current?.removeFile(file.id);
      console.error("Error uploading file:", error);
    }
  };

  const handleRemoveFile = (file: FilePondFile) => {
    setUploadedFiles(({ [file.id]: _removed, ...rest }) => rest);
  };

  const clearAttachments = () => {
    setUploadedFiles({});
    pondRef.current?.removeFiles();
  };

  return {
    pondRef,
    hasAttachments,
    media,
    setFiles,
    openFileExplorer,
    handleAddFile,
    handleRemoveFile,
    clearAttachments,
  };
}
