import { useEffect, useRef, useState } from 'react';

type Props = {
  data: any;
  unanswered?: boolean;
  editing?: boolean;
  disabled?: boolean;
  onChange: (arg0: any) => void;
};

function Editor(props: Props) {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, BalloonEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, // v3+
      BalloonEditor: require('ckeditor5-custom-build/build/ckeditor'),
    };
    setEditorLoaded(true);
  }, []);

  return (
    <article
      className={`prose prose-sm prose-slate max-w-full break-all ${
        props.unanswered ? 'border-b-1 border-slate-300 outline-none' : ''
      }${props.editing ? 'border-b-1 border-slate-300' : ''}`}
    >
      {editorLoaded ? (
        <CKEditor
          type=""
          editor={BalloonEditor}
          data={props.data}
          disabled={props.disabled}
          onChange={(event, editor) => {
            const data = editor.getData();
            props.onChange(data);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </article>
  );
}

export default Editor;
