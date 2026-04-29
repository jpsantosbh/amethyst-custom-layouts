// Three Columns Tall layout.
//
// Screen is split into three full-height columns:
//   left:   25% width
//   center: 50% width
//   right:  25% width
//
// Windows are distributed across the columns following a fixed fill order.
// Let (L, C, R) be the count of windows in each column. Starting from (0,1,0),
// each new window is added by these rules (checked in order):
//   1. if L == R AND L == C + 2 AND C < 3 → add to CENTER
//   2. else if L == R                     → add to LEFT
//   3. else (L > R)                       → add to RIGHT
//
// This produces:
//   1: (0,1,0)   2: (1,1,0)   3: (1,1,1)   4: (2,1,1)   5: (2,1,2)
//   6: (3,1,2)   7: (3,1,3)   8: (3,2,3)   9: (4,2,3)  10: (4,2,4)
//  11: (4,3,4)  12: (5,3,4)  13: (5,3,5)  14+: sides keep alternating, center capped at 3.
//
// Window order convention:
//   windows[0] → center, top (main)
//   windows[1] → left,   top
//   windows[2] → right,  top
//   then windows[3..] fill in the order dictated by the rules above.
// Within each column, windows stack vertically and split that column's height equally.

function layout() {
    return {
        name: "Three Columns Tall",
        initialState: {},
        getFrameAssignments: (windows, screenFrame) => {
            const n = windows.length;
            if (n === 0) return {};

            const sf = screenFrame;

            // Build column assignments by replaying the fill rule.
            const leftCol = [];
            const centerCol = [];
            const rightCol = [];

            for (let i = 0; i < n; i++) {
                if (i === 0) {
                    centerCol.push(i);
                    continue;
                }
                const L = leftCol.length;
                const C = centerCol.length;
                const R = rightCol.length;

                if (L === R && L === C + 2 && C < 3) {
                    centerCol.push(i);
                } else if (L === R) {
                    leftCol.push(i);
                } else {
                    rightCol.push(i);
                }
            }

            const leftW = sf.width * 0.25;
            const centerW = sf.width * 0.5;
            const rightW = sf.width * 0.25;

            const leftX = sf.x;
            const centerX = sf.x + leftW;
            const rightX = sf.x + leftW + centerW;

            const frames = {};

            const placeColumn = (xPos, colW, indices) => {
                if (indices.length === 0) return;
                const rowH = sf.height / indices.length;
                indices.forEach((wi, j) => {
                    frames[windows[wi].id] = {
                        x: xPos,
                        y: sf.y + rowH * j,
                        width: colW,
                        height: rowH,
                        isMain: wi === 0
                    };
                });
            };

            placeColumn(leftX, leftW, leftCol);
            placeColumn(centerX, centerW, centerCol);
            placeColumn(rightX, rightW, rightCol);

            return frames;
        }
    };
}
