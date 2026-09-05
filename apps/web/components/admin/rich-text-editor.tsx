"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  FileUp
} from "lucide-react";
import { useState } from "react";
import * as mammoth from "mammoth";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "project"); // Use the existing project type in vercel blob

      const response = await fetch("/api/admin/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (e.target) e.target.value = '';
    }
  };

  const handleDocumentImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const arrayBuffer = await file.arrayBuffer();

      if (file.name.toLowerCase().endsWith(".docx")) {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        editor.commands.insertContent(result.value);
        if (result.messages.length > 0) {
          console.warn("Mammoth conversion messages:", result.messages);
        }
      } else if (file.name.toLowerCase().endsWith(".pdf")) {
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let textContent = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          const strings = text.items.map((item: any) => item.str);
          textContent += strings.join(" ") + "\n\n";
        }
        
        const html = textContent
          .split("\n\n")
          .filter(p => p.trim())
          .map(p => `<p>${p.trim()}</p>`)
          .join("");
        editor.commands.insertContent(html);
      } else {
        alert("Chỉ hỗ trợ file .docx hoặc .pdf");
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Không thể import file này.");
    } finally {
      setIsImporting(false);
      if (e.target) e.target.value = '';
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const buttonClass = (isActive: boolean) => 
    `p-2 rounded-lg transition-colors flex items-center justify-center ${
      isActive 
        ? "bg-cyan-100 text-cyan-700 font-bold" 
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200 rounded-t-xl items-center sticky top-0 z-10">
      <div className="flex gap-1 border-r border-slate-200 pr-2 mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive("underline"))}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 border-r border-slate-200 pr-2 mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 4 }))}
          title="Heading 4"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 border-r border-slate-200 pr-2 mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass(editor.isActive("blockquote"))}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 border-r border-slate-200 pr-2 mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={buttonClass(editor.isActive({ textAlign: 'left' }))}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={buttonClass(editor.isActive({ textAlign: 'center' }))}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={buttonClass(editor.isActive({ textAlign: 'right' }))}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={buttonClass(editor.isActive({ textAlign: 'justify' }))}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 border-r border-slate-200 pr-2 mr-1">
        <button
          type="button"
          onClick={setLink}
          className={buttonClass(editor.isActive("link"))}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <label className={`cursor-pointer ${buttonClass(false)} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`} title="Upload Image">
          <ImageIcon className="w-4 h-4" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
        </label>
        <label className={`cursor-pointer ${buttonClass(false)} ${isImporting ? 'opacity-50 pointer-events-none' : ''}`} title="Import Document (Word/PDF)">
          <FileUp className="w-4 h-4 text-cyan-600" />
          <input 
            type="file" 
            accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            className="hidden" 
            onChange={handleDocumentImport}
          />
        </label>
      </div>

      <div className="flex gap-1 ml-auto">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={buttonClass(false)}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={buttonClass(false)}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-[1.8] prose-a:text-cyan-600 hover:prose-a:text-cyan-700 prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-slate-200 prose-strong:text-slate-900 min-h-[250px] p-6 focus:outline-none',
      },
      handlePaste: (view, event, slice) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        let hasImage = false;
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            hasImage = true;
            const file = item.getAsFile();
            if (file) {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("type", "project");

              fetch("/api/admin/files", {
                method: "POST",
                body: formData,
              })
                .then(res => res.json())
                .then(data => {
                  if (data.url) {
                    const { schema } = view.state;
                    const node = schema.nodes.image.create({ src: data.url });
                    const tr = view.state.tr.replaceSelectionWith(node);
                    view.dispatch(tr);
                  }
                })
                .catch(err => {
                  console.error("Paste image upload error:", err);
                });
            }
          }
        }
        
        // Return true if we handled an image paste to prevent default behavior for images.
        // We still let text pass through if it's mixed, but usually clipboard events with images are handled this way.
        return hasImage;
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "project");

            fetch("/api/admin/files", {
              method: "POST",
              body: formData,
            })
              .then(res => res.json())
              .then(data => {
                if (data.url) {
                  const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  if (coordinates) {
                    const { schema } = view.state;
                    const node = schema.nodes.image.create({ src: data.url });
                    const tr = view.state.tr.insert(coordinates.pos, node);
                    view.dispatch(tr);
                  }
                }
              })
              .catch(err => {
                console.error("Drop image upload error:", err);
              });
            return true; // handled
          }
        }
        return false;
      }
    },
  });

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10 transition-all">
      <MenuBar editor={editor} />
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar bg-slate-50/30">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
