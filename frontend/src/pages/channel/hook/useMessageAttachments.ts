import { useRef, useState } from "react";
import type { FilePond } from "react-filepond";
import type { FilePondFile } from "filepond";
import { useUploadFileMutation } from "../../../services/file-api";
import type { StrifeFile } from "../../../types/file";
import type { MediaRequest } from "../types/channel";

export function useMessageAttachments(channelId: string) {
  const [files, setFiles] = useState<FilePondFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, StrifeFile>
  >({});
  const pondRef = useRef<FilePond>(null);

  const [uploadFileMutation] = useUploadFileMutation();

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
    const f: File = file.file as File;

    const formData = new FormData();
    formData.append("file", f);
    formData.append("channelId", channelId);
    try {
      const uploaded = await uploadFileMutation(formData).unwrap();

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
