// Import React dependencies.
import React, { useState } from 'react';

import { AnsweredBox } from './AnsweredBox';
import { EditingBox } from './EditingBox';
import UnansweredBox from './UnansweredBox';

type Props = {
  question: String;
  answer: String;
  unanswered: boolean;
  id: string;
  index: number;
};

const QuestionBox = (props: Props) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="m-2">
      {editing && <EditingBox {...props} setEditing={setEditing} />}
      {!editing && !props.unanswered && (
        <AnsweredBox {...props} setEditing={setEditing} />
      )}
      {!editing && props.unanswered && <UnansweredBox {...props} />}
    </div>
  );
};

export { QuestionBox };
