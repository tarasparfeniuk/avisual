import React from "react";
import { FieldEditorModal } from "./FieldEditorModal";
import { IPathfindingInput } from "../../model/pathfinding/PathfindingInput";
import { Field } from "../../model/pathfinding/map/Field";
import { FieldView } from "./Field";
import "./FieldSettings.css";
import { MazeGenerationsCountSlider } from "./components/MazeGenerationsCountSlider";
import { MazeGenerationButton } from "./components/MazeGenerationButton";
import { MazeSeedField } from "./components/MazeSeedField";

type FieldSettingsProps = { 
    model: IPathfindingInput,
    enabled: boolean
};

type FieldSettingsState = { 
    field: Field,
    showEditor: boolean
};

export class FieldSettings extends React.Component<FieldSettingsProps, FieldSettingsState> {
    
    constructor(props: FieldSettingsProps) {

        super(props);

        const { model } = props;

        this.showFieldEditor = this.showFieldEditor.bind(this);
        this.hideFieldEditor = this.hideFieldEditor.bind(this);
        
        this.onPropertyChange = this.onPropertyChange.bind(this);

        model.setRandomMaze();

        this.state = { 
            field: model.field,
            showEditor: false
        };
    }

    componentDidMount() {

        const { model } = this.props;
        
        model.onInputUpdated(() => {
            this.setState({ field: model.field });
        })
    }

    render() {

        const { enabled, model } = this.props;
        const { 
            field,
            showEditor
        } = this.state;

        const classNames = ['field-settings-toolbar'];
        
        if (!enabled || !model.canUpdate) classNames.push('disabled');
        
        return (
            <div className={classNames.join(' ')}>
                <div className="col">
                    <MazeGenerationsCountSlider model={model} disabled={!enabled} />
                    <MazeGenerationButton model={model} disabled={!enabled} />
                </div>
                <div className="col">
                    <div className="field-container" onClick={this.showFieldEditor}>
                        <FieldView value={field} />
                    </div>
                </div>
                <MazeSeedField model={model} disabled={!enabled} />
                <FieldEditorModal model={model} isOpen={showEditor} hide={this.hideFieldEditor} />
            </div>
        );
    }

    private onPropertyChange() {

        const { model } = this.props;

        const stateUpdate = {
            field: model.field,
        };

        this.setState(stateUpdate);
    }

    private hideFieldEditor(): void {

        const { model } = this.props;

        const stateUpdate: FieldSettingsState = {
            field: model.field,
            showEditor: false
        };

        this.setState(stateUpdate);
    }

    private showFieldEditor(): void {

        const { enabled } = this.props;

        if (enabled) this.setState({ showEditor: true });
    }
}
