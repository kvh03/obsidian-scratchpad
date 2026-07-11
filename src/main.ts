import { Plugin, Notice } from "obsidian";
import { ScratchpadView, VIEW_TYPE_SCRATCHPAD } from "./scratchpadview";

const SCRATCHPAD_FILE_NAME = "history.json";

export default class ScratchpadPlugin extends Plugin {
    async onload() {
        this.registerView(VIEW_TYPE_SCRATCHPAD, (leaf) => new ScratchpadView(leaf, this));

        this.addRibbonIcon("notebook-pen", "Open scratchpad", async () => {
            await this.toggleView();
        });

        this.addCommand({
            id: "open-scratchpad-view",
            name: "Open",
            callback: () => this.activateView(),
        });

        this.registerEvent(
            this.app.workspace.on("editor-menu", (menu, editor) => {
                const selection = editor.getSelection();
                if (!selection) return;

                menu.addItem((item) => {
                    item
                        .setTitle("Copy to Scratchpad")
                        .setIcon("notebook-pen")
                        .onClick(async () => {
                            await this.appendToScratchpad(selection);
                        });
                });
            })
        );
    }

    async appendToScratchpad(textToAppend: string) {
        // Find if the view is open
        const workspace = this.app.workspace;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_SCRATCHPAD);
        
        if (leaves.length > 0) {
            // View is open - update live UI
            const scratchpadView = leaves[0].view as ScratchpadView;
            if (scratchpadView) {
                const currentText = scratchpadView.getTextValue();
                const newText = currentText ? `${currentText}\n\n${textToAppend}` : textToAppend;
                scratchpadView.setTextValue(newText);
                await scratchpadView.saveContentToPlugin();
            }
        } else {
            // View is closed - modify the saved history file in background
            const currentData = await this.loadScratchpadContent() || { text: "", canvas: "" };
            const newText = currentData.text ? `${currentData.text}\n\n${textToAppend}` : textToAppend;
            await this.saveScratchpadContent(newText, currentData.canvas);
        }
        
        new Notice("Copied to Scratchpad");
    }

    async saveScratchpadContent(text: string, canvasData: string) {
        const data = {
            text: text,
            canvas: canvasData
        };
        const filePath = this.manifest.dir + "/" + SCRATCHPAD_FILE_NAME;
        await this.app.vault.adapter.write(filePath, JSON.stringify(data));
    }

    async loadScratchpadContent(): Promise<{ text: string, canvas: string } | null> {
        const filePath = this.manifest.dir + "/" + SCRATCHPAD_FILE_NAME;
        if (await this.app.vault.adapter.exists(filePath)) {
            const content = await this.app.vault.adapter.read(filePath);
            try {
                return JSON.parse(content);
            } catch {
                return null;
            }
        }
        return null;
    }

    private async activateView() {
        const workspace = this.app.workspace;
        const existingLeaf = workspace.getLeavesOfType(VIEW_TYPE_SCRATCHPAD)[0];
        if (existingLeaf) {
            await workspace.revealLeaf(existingLeaf);
            return;
        }

        const newLeaf = workspace.getRightLeaf(false) ?? workspace.getLeaf(true);
        await newLeaf.setViewState({
            type: VIEW_TYPE_SCRATCHPAD,
            active: true,
        });
        await workspace.revealLeaf(newLeaf);
    }

    private async toggleView() {
        const workspace = this.app.workspace;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_SCRATCHPAD);
        if (leaves.length === 0) {
            await this.activateView();
            return;
        }

        const leaf = leaves[0];
        const activeView = workspace.getActiveViewOfType(ScratchpadView);

        if (activeView && activeView.leaf === leaf) {
            const otherLeaf = workspace.getLeaf(false);
            if (otherLeaf && otherLeaf !== leaf) {
                workspace.setActiveLeaf(otherLeaf, { focus: true });
            } else {
                leaf.view.containerEl.blur();
            }
        } else {
            await workspace.revealLeaf(leaf);
        }
    }
}