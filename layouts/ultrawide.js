// Ultrawide layout — designed for super-wide displays.
//
// Window count → layout:
//   1 window:   full screen
//   2 windows:  50% | 50%
//   3 windows:  25% left | 50% center | 25% right
//   4 windows:  20% left | 30% center-L | 30% center-R | 20% right   (4 full-height columns)
//   N >= 4:     20% left | 60% center split into TWO 30% sub-columns | 20% right
//               extra windows stack vertically inside the center sub-columns,
//               alternating left → right → left → right → ...
//
// Window order convention (matches Amethyst's "first window = main"):
//   windows[0] → main (full screen, or top of center-LEFT sub-column)
//   windows[1] → left sidebar (or right half when N=2)
//   windows[2] → right sidebar
//   windows[3..] → additional slots in the center sub-columns
//                   (windows[3] → center-R top, windows[4] → center-L row 2, etc.)

function layout() {
    return {
        name: "Ultrawide",
        initialState: {},
        getFrameAssignments: (windows, screenFrame) => {
            const n = windows.length;
            if (n === 0) return {};

            const sf = screenFrame;
            const frames = {};
            const assign = (win, frame) => { frames[win.id] = frame; };

            if (n === 1) {
                assign(windows[0], {
                    x: sf.x,
                    y: sf.y,
                    width: sf.width,
                    height: sf.height
                });
                return frames;
            }

            if (n === 2) {
                const half = sf.width / 2;
                assign(windows[0], {
                    x: sf.x,
                    y: sf.y,
                    width: half,
                    height: sf.height,
                    isMain: true
                });
                assign(windows[1], {
                    x: sf.x + half,
                    y: sf.y,
                    width: half,
                    height: sf.height,
                    isMain: false
                });
                return frames;
            }

            if (n === 3) {
                const sideW = sf.width / 4;
                const centerW = sf.width / 2;
                // main (center)
                assign(windows[0], {
                    x: sf.x + sideW,
                    y: sf.y,
                    width: centerW,
                    height: sf.height,
                    isMain: true
                });
                // left sidebar
                assign(windows[1], {
                    x: sf.x,
                    y: sf.y,
                    width: sideW,
                    height: sf.height,
                    isMain: false
                });
                // right sidebar
                assign(windows[2], {
                    x: sf.x + sideW + centerW,
                    y: sf.y,
                    width: sideW,
                    height: sf.height,
                    isMain: false
                });
                return frames;
            }

            // n >= 4
            const sideW = sf.width / 5;
            const centerTotalW = (sf.width * 3) / 5;
            const subColW = centerTotalW / 2;
            const leftSubX = sf.x + sideW;
            const rightSubX = sf.x + sideW + subColW;

            // left sidebar (full height)
            assign(windows[1], {
                x: sf.x,
                y: sf.y,
                width: sideW,
                height: sf.height,
                isMain: false
            });
            // right sidebar (full height)
            assign(windows[2], {
                x: sf.x + sideW + centerTotalW,
                y: sf.y,
                width: sideW,
                height: sf.height,
                isMain: false
            });

            // Center windows: indices [0, 3, 4, 5, ...] alternate-fill the two sub-columns.
            // Convention: window[0] (main) goes to the top of the center-LEFT sub-column.
            const centerOrder = [0];
            for (let i = 3; i < n; i++) centerOrder.push(i);

            const leftSubWindows = [];
            const rightSubWindows = [];
            centerOrder.forEach((wi, k) => {
                if (k % 2 === 0) leftSubWindows.push(wi);
                else rightSubWindows.push(wi);
            });

            const placeSubColumn = (xPos, winIndices) => {
                if (winIndices.length === 0) return;
                const rowH = sf.height / winIndices.length;
                winIndices.forEach((wi, j) => {
                    assign(windows[wi], {
                        x: xPos,
                        y: sf.y + rowH * j,
                        width: subColW,
                        height: rowH,
                        isMain: wi === 0
                    });
                });
            };

            placeSubColumn(leftSubX, leftSubWindows);
            placeSubColumn(rightSubX, rightSubWindows);

            return frames;
        }
    };
}
