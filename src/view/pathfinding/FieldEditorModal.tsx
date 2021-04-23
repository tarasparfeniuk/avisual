import { IconButton, Modal } from "@fluentui/react";
import React from "react";

import { useId } from '@uifabric/react-hooks';
import "./FieldEditorModal.css";
import { IPathfindingInput } from "../../model/pathfinding/PathfindingInput";
import { FieldEditor } from "./FieldEditor";

type FieldEditorModalProps = {
    isOpen: boolean,
    model: IPathfindingInput,
    hide: () => void
}

export const FieldEditorModal: React.FunctionComponent<FieldEditorModalProps> = ({ isOpen, model, hide }) => {

    const titleId = useId('title');
  
    return (
        <Modal
          titleAriaId={titleId}
          isOpen={isOpen}
          onDismiss={hide}
          isBlocking={false}
        >
          <div className="modal-header">
            <span id={titleId}>Edit source array</span>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel="Close array editor"
              onClick={hide}
            />
          </div>
          <div className="modal-body">
            <FieldEditor model={model} />
          </div>
        </Modal>
    );
  };
