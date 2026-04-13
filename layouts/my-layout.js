// Starter custom Amethyst layout.
// Filename (minus .js) becomes the layout key — rename as desired.
// Deploy by copying to: ~/Library/Application Support/Amethyst/Layouts/

function layout() {
    return {
        name: "My Layout",
        initialState: {
            mainPaneRatio: 0.5
        },
        commands: {
            expandMain: {
                description: "Expand main pane",
                updateState: (state) => ({
                    ...state,
                    mainPaneRatio: Math.min(1, state.mainPaneRatio + 0.05)
                })
            },
            shrinkMain: {
                description: "Shrink main pane",
                updateState: (state) => ({
                    ...state,
                    mainPaneRatio: Math.max(0, state.mainPaneRatio - 0.05)
                })
            }
        },
        getFrameAssignments: (windows, screenFrame, state) => {
            if (windows.length === 0) return {};

            const mainWidth = Math.round(screenFrame.width * state.mainPaneRatio);
            const secondaryCount = windows.length - 1;
            const secondaryHeight = secondaryCount > 0
                ? Math.round(screenFrame.height / secondaryCount)
                : 0;

            return windows.reduce((frames, window, index) => {
                let frame;
                if (index === 0) {
                    frame = {
                        x: screenFrame.x,
                        y: screenFrame.y,
                        width: mainWidth,
                        height: screenFrame.height,
                        isMain: true,
                        unconstrainedDimension: "horizontal"
                    };
                } else {
                    frame = {
                        x: screenFrame.x + mainWidth,
                        y: screenFrame.y + secondaryHeight * (index - 1),
                        width: screenFrame.width - mainWidth,
                        height: secondaryHeight,
                        isMain: false,
                        unconstrainedDimension: "horizontal"
                    };
                }
                return { ...frames, [window.id]: frame };
            }, {});
        },
        recommendMainPaneRatio: (ratio, state) => ({
            ...state,
            mainPaneRatio: ratio
        })
    };
}
