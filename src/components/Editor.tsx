import { useEffect, useState } from 'react';

type Props = {
  data: any;
  unanswered?: boolean;
  editing?: boolean;
  disabled?: boolean;
  onChange: (arg0: any) => void;
};

const { CKEditor } = require('@ckeditor/ckeditor5-react'); // v3+
const BalloonEditor = require('ckeditor5-custom-build/build/ckeditor');

function Editor(props: Props) {
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
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
          onChange={(_event: any, editor: { getData: () => any }) => {
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
