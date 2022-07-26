// import WebViewer from '@pdftron/webviewer';
import { useEffect, useRef } from 'react';

const PdfViewer = ({ file }: { file: string }) => {
  const viewer = useRef(null);

  useEffect(() => {
    const loadWebViewer = async () => {
      const WebViewer = (await import('@pdftron/webviewer')).default;
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
              'thumbnailControl',
              'contextMenuPopup',
              'downloadButton',
              'printButton',
              'languageButton',
            ],
          },
          viewer.current
        );
      }
    };
    loadWebViewer();
  }, []);

  return <div className="webviewer h-full grow" ref={viewer} />;
};

export default PdfViewer;
