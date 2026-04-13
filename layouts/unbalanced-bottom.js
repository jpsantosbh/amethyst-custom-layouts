// unbalanced-bottom layout — two-row layout favoring the top row,
// allowing it up to 2 more windows than the bottom row.
//
// Window count -> layout:
//   1 window:   full screen
//   2 windows:  side by side (50/50)
//   3 windows:  2 top, 1 bottom
//   4 windows:  3 top, 1 bottom
//   5 windows:  3 top, 2 bottom
//   6 windows:  4 top, 2 bottom
//   7 windows:  4 top, 3 bottom
//   8 windows:  5 top, 3 bottom
//   ...         top row can have at most 2 more than bottom

function layout() {
    return {
        name: "Unbalanced Bottom",
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
                    height: sf.height
                });
                assign(windows[1], {
                    x: sf.x + half,
                    y: sf.y,
                    width: half,
                    height: sf.height
                });
                return frames;
            }

            // n >= 3: two-row layout, top row preferred, max diff of 2
            var topCount = 2;
            var bottomCount = 1;
            for (var w = 4; w <= n; w++) {
                if (topCount - bottomCount < 2) {
                    topCount++;
                } else {
                    bottomCount++;
                }
            }

            var rowH = sf.height / 2;
            var topW = sf.width / topCount;
            var bottomW = sf.width / bottomCount;

            for (var i = 0; i < topCount; i++) {
                assign(windows[i], {
                    x: sf.x + topW * i,
                    y: sf.y,
                    width: topW,
                    height: rowH
                });
            }

            for (var j = 0; j < bottomCount; j++) {
                assign(windows[topCount + j], {
                    x: sf.x + bottomW * j,
                    y: sf.y + rowH,
                    width: bottomW,
                    height: rowH
                });
            }

            return frames;
        }
    };
}
