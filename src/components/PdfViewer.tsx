import WebViewer from '@pdftron/webviewer';
import { useEffect, useRef } from 'react';

const PdfViewer2 = ({ file }: { file: string }) => {
  const viewer = useRef(null);

  useEffect(() => {
    if (viewer.current) {
      WebViewer(
        {
          path: '/lib',
          initialDoc: `/api/getPdf/${encodeURIComponent(file)}/`,
          disabledElements: [
            'viewControlsButton',
            'viewControlsOverlay',
            'toolsOverlay',
            'ribbonsDropdown',
            'selectToolButton',
            'panToolButton',
            'leftPanelButton',
            'toggleNotesButton',
            'toolsHeader',
          ],
        },
        viewer.current
      );
      // .then((instance) => {
      // const { docViewer } = instance;
      // docViewer;
      // you can now call WebViewer APIs here...
      // });
    }
  }, []);

  return (
    <div
      className="webviewer h-4/5"
      ref={viewer}
      // style={{ height: '100vh' }}
    >
      {/* <div className="header">React sample</div> */}
    </div>
  );
};

export default PdfViewer2;
