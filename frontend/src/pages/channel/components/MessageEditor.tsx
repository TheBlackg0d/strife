import React from "react";

interface MessageEditorProps {
  content?: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export default function MessageEditor({
  content,
  onSubmit,
  onCancel,
}: MessageEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        contentEditable
        className="flex items-center justify-right text-center border border-gray-100 bg-gray-800 rounded-lg p-2 focus:outline-none "
      >
        {content}
      </div>
      <div className="flex justify-start gap-2 text-sm">
        <span>
          Press <span className="text-blue-500">Enter</span> to send
        </span>
        -
        <span>
          Press <span className="text-blue-500">Escape</span> to cancel
        </span>
      </div>
    </div>
  );
}
