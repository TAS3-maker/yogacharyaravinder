// Rich-text editor for blog content (TipTap). Produces plain HTML.
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect, useRef, useState } from 'react';
import { uploadImage } from './api.js';

const B = ({ on, active, title, children, disabled }) => (
  <button type="button" className={`tb${active ? ' tb--on' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={on} title={title} aria-label={title} disabled={disabled}>
    {children}
  </button>
);

export default function Editor({ value, onChange }) {
  const file = useRef();
  const [busy, setBusy] = useState(false);
  const [html, setHtml] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener' } },
      }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Load new content when switching posts
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return null;
  const c = () => editor.chain().focus();

  const link = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Link URL (leave empty to remove)', prev);
    if (url === null) return;
    if (!url) return c().unsetLink().run();
    c().extendMarkRange('link').setLink({ href: url, target: /^https?:/.test(url) && !url.includes('yogacharyaravinder.com') ? '_blank' : null }).run();
  };
  const addImage = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true);
    try {
      const { url } = await uploadImage(f);
      const alt = window.prompt('Describe the image (alt text, good for SEO)', '') || '';
      c().setImage({ src: url, alt }).run();
    } catch (err) { alert(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="ed">
      <div className="ed__bar" role="toolbar" aria-label="Formatting">
        <B title="Heading 2" active={editor.isActive('heading', { level: 2 })} on={() => c().toggleHeading({ level: 2 }).run()}>H2</B>
        <B title="Heading 3" active={editor.isActive('heading', { level: 3 })} on={() => c().toggleHeading({ level: 3 }).run()}>H3</B>
        <B title="Heading 4" active={editor.isActive('heading', { level: 4 })} on={() => c().toggleHeading({ level: 4 }).run()}>H4</B>
        <B title="Paragraph" active={editor.isActive('paragraph')} on={() => c().setParagraph().run()}>¶</B>
        <span className="ed__sep" />
        <B title="Bold" active={editor.isActive('bold')} on={() => c().toggleBold().run()}><b>B</b></B>
        <B title="Italic" active={editor.isActive('italic')} on={() => c().toggleItalic().run()}><i>I</i></B>
        <B title="Underline" active={editor.isActive('underline')} on={() => c().toggleUnderline().run()}><u>U</u></B>
        <B title="Link" active={editor.isActive('link')} on={link}>🔗</B>
        <span className="ed__sep" />
        <B title="Bullet list" active={editor.isActive('bulletList')} on={() => c().toggleBulletList().run()}>• List</B>
        <B title="Numbered list" active={editor.isActive('orderedList')} on={() => c().toggleOrderedList().run()}>1. List</B>
        <B title="Quote" active={editor.isActive('blockquote')} on={() => c().toggleBlockquote().run()}>❝</B>
        <B title="Divider" on={() => c().setHorizontalRule().run()}>―</B>
        <span className="ed__sep" />
        <B title="Insert image" on={() => file.current.click()} disabled={busy}>{busy ? 'Uploading…' : '🖼 Image'}</B>
        <input ref={file} type="file" accept="image/*" hidden onChange={addImage} />
        <span className="ed__sep" />
        <B title="Undo" on={() => c().undo().run()}>↶</B>
        <B title="Redo" on={() => c().redo().run()}>↷</B>
        <B title="Edit HTML" active={html} on={() => setHtml(!html)}>&lt;/&gt;</B>
      </div>
      {html ? (
        <textarea className="ed__html" value={value} onChange={(e) => { onChange(e.target.value); editor.commands.setContent(e.target.value, { emitUpdate: false }); }} spellCheck={false} />
      ) : (
        <EditorContent editor={editor} className="ed__body bprose" />
      )}
    </div>
  );
}
