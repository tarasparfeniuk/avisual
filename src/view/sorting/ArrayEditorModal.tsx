import { IconButton, Modal } from "@fluentui/react";
import React from "react";
import { ISortingInput } from "../../model/sorting/SortingInput";
import { ArrayEditor } from "./ArrayEditor";
import { useId } from '@uifabric/react-hooks';
import "./ArrayEditorModal.css";

type ArrayEditorModalProps = {
    isOpen: boolean,
    model: ISortingInput,
    hide: () => void
}

export const ArrayEditorModal: React.FunctionComponent<ArrayEditorModalProps> = ({ isOpen, model, hide }) => {

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
            <ArrayEditor model={model} />
          </div>
        </Modal>
    );
  };
