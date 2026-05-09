'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback } from 'react';

function ToolbarButton({ onClick, active, title, children }) {
	return (
		<button
			type="button"
			title={title}
			onMouseDown={(e) => { e.preventDefault(); onClick(); }}
			className={`rich-editor__toolbar-btn${active ? ' is-active' : ''}`}
		>
			{children}
		</button>
	);
}

export default function RichEditor({ initialContent = '', onChange, placeholder = 'Escribe aqui...' }) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: { class: 'content-link', rel: 'noopener noreferrer', target: '_blank' },
			}),
			Placeholder.configure({ placeholder }),
		],
		content: initialContent,
		onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
		editorProps: {
			attributes: { class: 'rich-editor__content' },
		},
	});

	const setLink = useCallback(() => {
		if (!editor) return;
		const prev = editor.getAttributes('link').href || '';
		const url = window.prompt('URL del enlace:', prev);
		if (url === null) return;
		if (url === '') {
			editor.chain().focus().unsetLink().run();
		} else {
			editor.chain().focus().setLink({ href: url }).run();
		}
	}, [editor]);

	if (!editor) return null;

	return (
		<div className="rich-editor">
			<div className="rich-editor__toolbar">
				<ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita">
					<strong>B</strong>
				</ToolbarButton>
				<ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva">
					<em>I</em>
				</ToolbarButton>
				<div className="rich-editor__toolbar-sep" />
				<ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titulo grande">
					H2
				</ToolbarButton>
				<ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titulo pequeno">
					H3
				</ToolbarButton>
				<div className="rich-editor__toolbar-sep" />
				<ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
					&#8226;&#8722;
				</ToolbarButton>
				<ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
					1.
				</ToolbarButton>
				<div className="rich-editor__toolbar-sep" />
				<ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Codigo">
					{'</>'}
				</ToolbarButton>
				<ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Cita">
					&ldquo;&rdquo;
				</ToolbarButton>
				<div className="rich-editor__toolbar-sep" />
				<ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Insertar enlace">
					&#128279;
				</ToolbarButton>
				{editor.isActive('link') && (
					<ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} active={false} title="Quitar enlace">
						&#128279;&#x0336;
					</ToolbarButton>
				)}
			</div>
			<EditorContent editor={editor} />
		</div>
	);
}
