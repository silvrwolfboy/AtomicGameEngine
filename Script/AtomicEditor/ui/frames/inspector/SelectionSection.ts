
import SerializableEditType = require("./SerializableEditType");
import AttributeInfoEdit = require("./AttributeInfoEdit");
import SelectionSectionUI = require("./SelectionSectionUI");

import "./ComponentAttributeUI";

abstract class SelectionSection extends Atomic.UISection {

    editType: SerializableEditType;
    attrLayout: Atomic.UILayout;
    suppressed: boolean = false;

    attrEdits: { [name: string]: AttributeInfoEdit } = {};

    constructor(editType: SerializableEditType) {

        super();

        this.editType = editType;

        this.text = editType.typeName;
        this.value = 1;

        this.createUI();

    }

    refresh() {

        for (var name in this.attrEdits) {

            this.attrEdits[name].refresh();

        }

    }

    suppress(value: boolean) {

        if (this.suppressed == value) {
            return;
        }

        this.suppressed = value;
        if (value) {
            this.visibility = Atomic.UI_WIDGET_VISIBILITY_GONE;
        } else {
            this.visibility = Atomic.UI_WIDGET_VISIBILITY_VISIBLE;
        }

    }

    createUI() {

        var attrLayout = this.attrLayout = new Atomic.UILayout(Atomic.UI_AXIS_Y);
        attrLayout.spacing = 3;
        attrLayout.layoutPosition = Atomic.UI_LAYOUT_POSITION_LEFT_TOP;
        attrLayout.layoutSize = Atomic.UI_LAYOUT_SIZE_AVAILABLE;

        this.contentRoot.addChild(attrLayout);

        for (var i in this.editType.attrInfos) {

            var attr = this.editType.attrInfos[i];

            if (attr.mode & Atomic.AM_NOEDIT)
                continue;

            var attrEdit = AttributeInfoEdit.createAttrEdit(this.editType, attr);

            if (!attrEdit)
                continue;

            this.attrEdits[attr.name] = attrEdit;

            attrLayout.addChild(attrEdit);

        }

        if (SelectionSection.customSectionUI[this.editType.typeName]) {

            var ui = new SelectionSection.customSectionUI[this.editType.typeName]();
            ui.createUI(this.editType);
            attrLayout.addChild(ui);

        }

    }

    static fontDesc: Atomic.UIFontDescription;

    static customSectionUI: { [typeName: string]: typeof SelectionSectionUI } = {};

    static registerCustomSectionUI(typeName: string, ui: typeof SelectionSectionUI) {

        SelectionSection.customSectionUI[typeName] = ui;

    }


    private static Ctor = (() => {

        var fd = SelectionSection.fontDesc = new Atomic.UIFontDescription();
        fd.id = "Vera";
        fd.size = 11;

    })();

}

export = SelectionSection;
