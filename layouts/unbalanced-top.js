// unbalanced-top layout — two-row layout favoring the bottom row,
// allowing it up to 2 more windows than the top row.
//
// Window count -> layout:
//   1 window:   full screen
//   2 windows:  side by side (50/50)
//   3 windows:  1 top, 2 bottom
//   4 windows:  1 top, 3 bottom
//   5 windows:  2 top, 3 bottom
//   6 windows:  2 top, 4 bottom
//   7 windows:  3 top, 4 bottom
//   8 windows:  3 top, 5 bottom
//   ...         bottom row can have at most 2 more than top

function layout() {
    return {
        name: "Unbalanced Top",
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

            // n >= 3: two-row layout, bottom row preferred, max diff of 2
            var topCount = 1;
            var bottomCount = 2;
            for (var w = 4; w <= n; w++) {
                if (bottomCount - topCount < 2) {
                    bottomCount++;
                } else {
                    topCount++;
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
