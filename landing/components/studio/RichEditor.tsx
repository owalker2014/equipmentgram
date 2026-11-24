"use client";

// The writing box: a toolbar on top, the text underneath.
// Built with Tiptap, an open-source editor (MIT License).

import { ActionIcon, Button, Group, Modal, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconBrandYoutube,
  IconClearFormatting,
  IconColumnInsertRight,
  IconColumnRemove,
  IconH2,
  IconH3,
  IconItalic,
  IconLineDashed,
  IconLink,
  IconList,
  IconListNumbers,
  IconPhoto,
  IconRowInsertBottom,
  IconRowRemove,
  IconStrikethrough,
  IconTable,
  IconTableOff,
  IconUnderline,
} from "@tabler/icons-react";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState, type ReactNode } from "react";
import { wordCount } from "@/lib/blog/text";
import type { UploadedImage } from "@/lib/blog/upload";

import "@/components/blog/blog.css";

type Props = {
  // The HTML the editor starts with. Later changes come back through onChange.
  initialHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
  // Sends a picture to storage. Leave it out to hide the picture button.
  onUploadImage?: (file: File) => Promise<UploadedImage>;
};

function ToolButton(props: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip label={props.label} withArrow openDelay={300}>
      <ActionIcon
        variant={props.active ? "filled" : "subtle"}
        color={props.active ? "blue" : "gray"}
        size="lg"
        aria-label={props.label}
        aria-pressed={!!props.active}
        disabled={props.disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={props.onClick}
      >
        {props.children}
      </ActionIcon>
    </Tooltip>
  );
}

const Separator = () => <span aria-hidden="true" className="mx-1 h-6 w-px bg-gray-200" />;

function Toolbar({ editor, onLink, onPicture, onVideo }: { editor: Editor; onLink: () => void; onPicture?: () => void; onVideo: () => void }) {
  const inTable = editor.isActive("table");
  const size = 18;
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 rounded-t-lg border-b border-gray-200 bg-gray-50 px-2 py-1.5">
      <ToolButton label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <IconH2 size={size} />
      </ToolButton>
      <ToolButton label="Smaller heading" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <IconH3 size={size} />
      </ToolButton>
      <Separator />
      <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <IconBold size={size} />
      </ToolButton>
      <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <IconItalic size={size} />
      </ToolButton>
      <ToolButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <IconUnderline size={size} />
      </ToolButton>
      <ToolButton label="Strike through" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <IconStrikethrough size={size} />
      </ToolButton>
      <Separator />
      <ToolButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <IconList size={size} />
      </ToolButton>
      <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <IconListNumbers size={size} />
      </ToolButton>
      <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <IconBlockquote size={size} />
      </ToolButton>
      <Separator />
      <ToolButton label="Link" active={editor.isActive("link")} onClick={onLink}>
        <IconLink size={size} />
      </ToolButton>
      {onPicture && (
        <ToolButton label="Picture" onClick={onPicture}>
          <IconPhoto size={size} />
        </ToolButton>
      )}
      <ToolButton label="YouTube video" onClick={onVideo}>
        <IconBrandYoutube size={size} />
      </ToolButton>
      <ToolButton
        label="Table"
        active={inTable}
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        disabled={inTable}
      >
        <IconTable size={size} />
      </ToolButton>
      <ToolButton label="Dividing line" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <IconLineDashed size={size} />
      </ToolButton>
      {inTable && (
        <>
          <Separator />
          <ToolButton label="Add a row below" onClick={() => editor.chain().focus().addRowAfter().run()}>
            <IconRowInsertBottom size={size} />
          </ToolButton>
          <ToolButton label="Add a column to the right" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            <IconColumnInsertRight size={size} />
          </ToolButton>
          <ToolButton label="Delete this row" onClick={() => editor.chain().focus().deleteRow().run()}>
            <IconRowRemove size={size} />
          </ToolButton>
          <ToolButton label="Delete this column" onClick={() => editor.chain().focus().deleteColumn().run()}>
            <IconColumnRemove size={size} />
          </ToolButton>
          <ToolButton label="Delete the table" onClick={() => editor.chain().focus().deleteTable().run()}>
            <IconTableOff size={size} />
          </ToolButton>
        </>
      )}
      <Separator />
      <ToolButton label="Remove formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <IconClearFormatting size={size} />
      </ToolButton>
      <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <IconArrowBackUp size={size} />
      </ToolButton>
      <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <IconArrowForwardUp size={size} />
      </ToolButton>
    </div>
  );
}

export default function RichEditor({ initialHtml, onChange, placeholder, onUploadImage }: Props) {
  const [words, setWords] = useState(() => wordCount(initialHtml));
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [pictureAlt, setPictureAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    // Next.js draws the page once on the server, where there is no editor yet.
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https", HTMLAttributes: { rel: null, target: null } },
      }),
      Image.configure({ allowBase64: false }),
      Youtube.configure({ nocookie: true, width: 640, height: 360 }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: placeholder || "Start writing here..." }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "blog-prose prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-700 prose-blockquote:border-blue-700 prose-blockquote:font-normal prose-blockquote:not-italic",
        "aria-label": "Post text",
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.isEmpty ? "" : current.getHTML();
      setWords(wordCount(html));
      onChange(html);
    },
  });

  if (!editor) {
    return <div className="h-96 animate-pulse rounded-lg border border-gray-200 bg-gray-50" aria-label="Loading the editor" />;
  }

  const openLink = () => {
    setLinkUrl(editor.getAttributes("link").href || "");
    setProblem("");
    setLinkOpen(true);
  };

  const applyLink = () => {
    let url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkOpen(false);
      return;
    }
    if (!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) url = `https://${url}`;
    if (/^javascript:/i.test(url)) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    // Put the cursor after the link, so the next thing typed does not replace the linked words.
    editor.commands.setTextSelection(editor.state.selection.to);
    setLinkOpen(false);
  };

  const applyVideo = () => {
    const ok = editor.chain().focus().setYoutubeVideo({ src: videoUrl.trim() }).run();
    if (!ok) {
      setProblem("That does not look like a YouTube address. Copy it from your browser's address bar.");
      return;
    }
    setVideoOpen(false);
    setVideoUrl("");
  };

  const insertPicture = async () => {
    if (!picture || !onUploadImage) return;
    setBusy(true);
    setProblem("");
    try {
      const uploaded = await onUploadImage(picture);
      editor
        .chain()
        .focus()
        .setImage({ src: uploaded.url, alt: pictureAlt.trim(), width: uploaded.width, height: uploaded.height })
        .run();
      setPicture(null);
      setPictureAlt("");
    } catch (error) {
      setProblem(String((error as any)?.message || error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="blog-editor rounded-lg border border-gray-300 bg-white">
      <Toolbar
        editor={editor}
        onLink={openLink}
        onVideo={() => {
          setProblem("");
          setVideoOpen(true);
        }}
        onPicture={onUploadImage ? () => fileInput.current?.click() : undefined}
      />
      <EditorContent editor={editor} />
      <div className="border-t border-gray-100 px-4 py-1.5 text-right text-xs text-gray-500">
        {words} {words === 1 ? "word" : "words"}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        aria-label="Choose a picture for the post text"
        onChange={(event) => {
          const file = event.target.files?.[0] || null;
          event.target.value = "";
          setProblem("");
          setPictureAlt("");
          setPicture(file);
        }}
      />

      <Modal opened={linkOpen} onClose={() => setLinkOpen(false)} title="Link" centered transitionProps={{ duration: 0 }}>
        <Stack>
          <TextInput
            label="Web address"
            placeholder="https://example.com or /pricing"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") applyLink();
            }}
            data-autofocus
          />
          <Text size="sm" c="dimmed">
            Select some words first, then add the link. Leave the box empty to remove a link.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setLinkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyLink}>Save link</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={videoOpen} onClose={() => setVideoOpen(false)} title="YouTube video" centered transitionProps={{ duration: 0 }}>
        <Stack>
          <TextInput
            label="Address of the video"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.currentTarget.value)}
            error={problem || undefined}
            data-autofocus
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setVideoOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyVideo}>Add video</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={!!picture} onClose={() => !busy && setPicture(null)} title="Add a picture" centered transitionProps={{ duration: 0 }}>
        <Stack>
          <Text size="sm">{picture?.name}</Text>
          <TextInput
            label="Describe the picture"
            description="Read aloud to blind visitors and used by Google Images. Example: Worn sprocket teeth on a mini excavator."
            value={pictureAlt}
            onChange={(event) => setPictureAlt(event.currentTarget.value)}
            data-autofocus
          />
          {problem && (
            <Text size="sm" c="red">
              {problem}
            </Text>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setPicture(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={insertPicture} loading={busy}>
              Upload and insert
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
