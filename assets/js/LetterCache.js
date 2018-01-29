class LetterCache {
    constructor() {
        this.name = "letter cache";
        this.associatedLetter = null;
        this.firstClick = false;
        this.firstIndex = -1;
    }
    // generation of binding characters randomly
    randomGenerate() {
        this.associatedLetter = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H"
        ];
        let length = this.associatedLetter.length;

        for (let i = 0; i < length; i++) {
            let random = Math.floor(Math.random() * length);

            // swap
            let tempNumber = this.associatedLetter[random];
            this.associatedLetter[random] = this.associatedLetter[i];
            this.associatedLetter[i] = tempNumber;
        }

        console.log(this.associatedLetter);
    }
    handleClick = (index, showArray) => {
        this.firstClick = !this.firstClick;

        if (this.firstClick) {
            // first tile clicked
            showArray[index] = this.associatedLetter[index];
            this.firstIndex = index;

            return {
                didMatch: false,
                showArray: showArray,
                doTimeout: false
            };
        } else {
            // second tile clicked
            switch (this.matchFilter(index)) {
                case 0:
                    showArray[index] = null;
                    console.log(showArray);
                    return {
                        didMatch: false,
                        doTimeout: false,
                        showArray: showArray
                    };
                case -1:
                    showArray[index] = this.associatedLetter[index];
                    console.log(showArray);
                    return {
                        didMatch: false,
                        doTimeout: true,
                        showArray: showArray,
                        timeout: 1000,
                        preIndex: this.firstIndex,
                        nextIndex: index
                    };
                default:
                    // do match
                    showArray[index] = this.associatedLetter[index];
                    return {
                        didMatch: true,
                        showArray: showArray,
                        preIndex: this.firstIndex,
                        nextIndex: index
                    };
            }
        }
    };
    matchFilter(nextIndex) {
        if (this.firstIndex === nextIndex) {
            return 0;
        }
        if (
            this.associatedLetter[this.firstIndex] ===
            this.associatedLetter[nextIndex]
        ) {
            // do match
            return 1;
        }

        return -1;
    }
}

module.exports = LetterCache;


