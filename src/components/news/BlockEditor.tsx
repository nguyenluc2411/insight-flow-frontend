"use client";
import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import ImageTool from "@editorjs/image";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
import api from "@/lib/axios";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

interface BlockEditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
  readOnly?: boolean;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ data, onChange, readOnly = false }) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        data: data || { blocks: [] },
        readOnly: readOnly,
        tools: {
          header: { class: Header as any, config: { placeholder: 'Enter a header', levels: [2, 3, 4], defaultLevel: 2 } },
          paragraph: { class: Paragraph as any, inlineToolbar: true },
          list: { class: List as any, inlineToolbar: true },
          image: {
            class: ImageTool as any,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  const formData = new FormData();
                  formData.append("image", file);
                  try {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
                    const token = useAuthStore.getState().accessToken;
                    const response = await axios.post(`${baseUrl}/api/v1/catalog/admin/news/upload-image`, formData, {
                      headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    return {
                      success: 1,
                      file: { url: response.data.file.url },
                    };
                  } catch (error) {
                    console.error("Image upload failed", error);
                    return { success: 0 };
                  }
                },
              },
            },
          },
        },
        onChange: async () => {
          if (editorRef.current) {
            const savedData = await editorRef.current.save();
            onChange(savedData);
          }
        }
      });
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div id="editorjs" className={`prose max-w-none bg-white p-6 rounded-lg min-h-[300px] border shadow-sm ${readOnly ? 'editor-readonly' : ''}`} />
      {readOnly && (
        <style>{`
          /* Force hide any interactive upload buttons or empty image blocks in readOnly mode */
          .editor-readonly .cdx-button {
            display: none !important;
          }
          .editor-readonly .image-tool--empty {
            display: none !important;
          }
          .editor-readonly input,
          .editor-readonly textarea,
          .editor-readonly [contenteditable="true"] {
            pointer-events: none !important;
          }
        `}</style>
      )}
    </>
  );
};

export default BlockEditor;
