// 5th-top layout — two-row layout favoring the bottom row.
//
// Window count -> layout:
//   1 window:   full screen
//   2 windows:  side by side (50/50)
//   3 windows:  1 top, 2 bottom
//   4 windows:  1 top, 3 bottom
//   5 windows:  2 top, 3 bottom
//   6 windows:  3 top, 3 bottom
//   7+ windows: added to the row with fewest windows (bottom row first on tie)

function layout() {
    return {
        name: "5th Top",
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

            // n >= 3: two-row layout
            // Determine how many windows go in each row
            var topCount, bottomCount;
            if (n === 3) {
                topCount = 1; bottomCount = 2;
            } else if (n === 4) {
                topCount = 1; bottomCount = 3;
            } else if (n === 5) {
                topCount = 2; bottomCount = 3;
            } else if (n === 6) {
                topCount = 3; bottomCount = 3;
            } else {
                // Start from the 6-window base (3 top, 3 bottom)
                // and distribute extras to the row with fewer windows,
                // preferring bottom on tie.
                topCount = 3;
                bottomCount = 3;
                var remaining = n - 6;
                while (remaining > 0) {
                    if (bottomCount <= topCount) {
                        bottomCount++;
                    } else {
                        topCount++;
                    }
                    remaining--;
                }
            }

            var rowH = sf.height / 2;
            var topW = sf.width / topCount;
            var bottomW = sf.width / bottomCount;

            // Top row: windows[0 .. topCount-1]
            for (var i = 0; i < topCount; i++) {
                assign(windows[i], {
                    x: sf.x + topW * i,
                    y: sf.y,
                    width: topW,
                    height: rowH
                });
            }

            // Bottom row: windows[topCount .. n-1]
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
