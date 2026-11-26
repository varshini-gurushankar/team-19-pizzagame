import { OvenDialController } from "./OvenDialController";
import { OvenDialModel } from "./OvenDialModel";

// semicircle for oven and dragging the needle
export class OvenDialView {
    private container: HTMLElement;
    private controller: OvenDialController;
    private selectedValueLabel: HTMLElement;


    // true while player holds needle, tick mark handling
    private dragging: boolean = false;
    private static readonly TICK_VALUES = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

    constructor(
        container: HTMLElement,
        controller: OvenDialController,
        selectedValueLabel: HTMLElement
    ) {
        this.container = container;
        this.controller = controller;
        this.selectedValueLabel = selectedValueLabel;

        this.buildDial();
        this.attachPointerEvents();
        this.render();

    }


    // dial HTML build including arc, labels and ticks for the needle
    private buildDial(): void {
    
        const ticksHtml = OvenDialView.TICK_VALUES.map(() => `<div class="oven-dial-tick"></div>`)
            .join("");
    
        this.container.innerHTML = `
        <div class="oven-dial-track"></div>
        ${ticksHtml}
        <div id="oven-needle" class="oven-dial-needle"></div>
        <div class="oven-dial-hub"></div>
        <span class="oven-dial-label-left">0</span>
        <span class="oven-dial-label-top">0.5</span>
        <span class="oven-dial-label-right">1</span>
        `;

        this.applyStyles();
    }

    // color and position of the dial
    private applyStyles(): void {

        const track = this.container.querySelector(
            ".oven-dial-track"
        ) as HTMLElement;

        

        const needle = this.container.querySelector(
            "#oven-needle"
        ) as HTMLElement;

        const hub = this.container.querySelector(
            ".oven-dial-hub"
        ) as HTMLElement;

        const labelLeft = this.container.querySelector(
            ".oven-dial-label-left"
        ) as HTMLElement;

        const labelTop = this.container.querySelector(
            ".oven-dial-label-top"
        ) as HTMLElement;

        const labelRight = this.container.querySelector(
            ".oven-dial-label-right"
        ) as HTMLElement;


        // handles the dial box, dragging, text adn cursor
        Object.assign(this.container.style, {
            position: "relative",
            width: "300px",
            height: "180px",
            margin: "30px auto",
            touchAction: "none",
            userSelect: "none",
            cursor: "grab"


        
    });

        // semi circle
        Object.assign(track.style, {
            position: "absolute",
            top: "20px",
            left: "0",
            width: "300px",
            height: "150px",
            border: "8px solid #263650",
            borderBottom: "none",
            borderRadius: "150px 150px 0 0",
            boxSizing: "border-box"
        });

        // needle 
        Object.assign(needle.style, {
            position: "absolute",
            bottom: "10px",
            left: "calc(50% - 2px)",
            width: "4px",
            height: "130px",
            backgroundColor: "#263650",
            transformOrigin: "bottom center",
           
        });

        // middle circle of the needle
        Object.assign(hub.style, {
            position: "absolute",
            bottom: "-4px",
            left: "calc(50% - 14px)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#fffdf4",
            border: "3px solid #263650"
        });

        // 0.5 label
        Object.assign(labelTop.style, {
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: "bold",
            color: "#263650",
            fontSize: "20px"
        });


        // 1 label
        Object.assign(labelRight.style, {
            position: "absolute",
            bottom: "6px",
            right: "-20px",
            fontWeight: "bold",
            color: "#263650",
            fontSize: "20px"
        });

        // 0 label
        Object.assign(labelLeft.style, {
            position: "absolute",
            bottom: "6px",
            left: "-20px",
            fontWeight: "bold",
            color: "#263650",
            fontSize: "20px"
        });

        // rotate each tick to its value angle on the arc
        const ticks = this.container.querySelectorAll(".oven-dial-tick");

        ticks.forEach((tick, i) => {
            const value = OvenDialView.TICK_VALUES[i];
            const angleDeg = OvenDialModel.decimalToDegrees(value);

            Object.assign((tick as HTMLElement).style, {
                position: "absolute",
                bottom: "10px",
                left: "calc(50% - 1px)",
                width: "2px",
                height: "140px",
                background: "linear-gradient(to bottom, #c9a888 14px, transparent 14px)",
                pointerEvents: "none",
                transformOrigin: "bottom center",
                transform: `rotate(${angleDeg}deg)`
            });
        });
    
    }

    // angle to hub 
    private toAngle(clientX: number, clientY: number): number | null {
        const rect = this.container.getBoundingClientRect();
    
        if (rect.width === 0) {
            return null;
        }
    
        
        const hubX = rect.left + rect.width / 2;
        const hubY = rect.bottom - 10;
    
        return Math.atan2(hubY - clientY, clientX - hubX);
    }

    // dragging setup
    private attachPointerEvents(): void {
        this.container.addEventListener("pointerdown", (event) => {
            this.dragging = true;
            this.container.setPointerCapture?.(event.pointerId);
            this.updateFromPointer(event.clientX, event.clientY);
        });

        this.container.addEventListener("pointermove", (event) => {
            if (!this.dragging){
                return;
            }
            this.updateFromPointer(event.clientX, event.clientY);
        });

        const endDrag = () => {
            this.dragging = false;
        };

        this.container.addEventListener("pointerup", endDrag);
        this.container.addEventListener("pointercancel", endDrag);
      

    }

    // update pointer position and send it to the controller
    private updateFromPointer(clientX: number, clientY: number): void {
        const angle = this.toAngle(clientX, clientY);
    
        if (angle === null) {
            return;
        }
    
        this.controller.setAngle(angle);
    }

    // rotates needle and update decimal text
    render(): void {
        const value = this.controller.getSelectedDecimal();
        const angleDeg = OvenDialModel.decimalToDegrees(value);

        const needle = this.container.querySelector(
            "#oven-needle"
        ) as HTMLElement;

        needle.style.transform = `rotate(${angleDeg}deg)`;
        this.selectedValueLabel.textContent = value.toFixed(2);
    }

}







