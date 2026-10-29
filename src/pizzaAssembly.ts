
export function setupSliceSlider(onChange: (slices: number) => void): void {

    // reads player's selected number
    const slider = document.getElementById("slice-slider") as HTMLInputElement | null;

    // for updating the number in the label (default: 1)
    const count = document.getElementById("slice-count");

    // for choosing to add "S" or not to "SLICE"
    const word = document.getElementById("slice-word");

    // makes sure all elements are present before resuming
    if (!slider || !count || !word) {
        console.error("Slice slider elements not found");
        return;
    }

    function update(): void {
        // converts string to int
        const slices = Number(slider.value);

        // updates num in label
        count.textContent = String(slices);

        // if 1 use SLICE if not use SLICES
        word.textContent = slices === 1 ? "SLICE" : "SLICES";

        // stores current num of slices for future
        onChange(slices);
    };

    // when slider changes run update
    slider.addEventListener("input", update);
    update();
    }

setupSliceSlider((slices) => console.log("Slices:", slices));


//Slider value to select slices (used in serve.ts)
export function getSelectedSlices(): number | null { 
    const slider = document.getElementById("slice-slider") as HTMLInputElement | null;
    return slider ? Number(slider.value) : null;
}