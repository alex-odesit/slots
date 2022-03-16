import { Application, Texture, Container, Sprite, Graphics, TextStyle, Text } from "pixi.js";
import "./style.css";
const app = new Application({
    width: 1280,
    height: 720,
});
document.body.appendChild(app.view);
const slots: any[] = [];
const stoper: boolean[] = [false, false, false, false, false];
const play: boolean[] = [false, false, false, false, false];
const timeId: number[] = [];
let extraStop = false;
let spinPictureSprite: Sprite;
let spinBtnArrow: Texture[] = [];
let slotTextures: Texture[] = [];
app.loader
    .add("./assets/images/01.png")
    .add("./assets/images/02.png")
    .add("./assets/images/03.png")
    .add("./assets/images/04.png")
    .add("./assets/images/05.png")
    .add("./assets/images/06.png")
    .add("./assets/images/07.png")
    .add("./assets/images/08.png")
    .add("./assets/images/09.png")
    .add("./assets/images/10.png")
    .add("./assets/images/11.png")
    .add("./assets/images/spin_btn.png")
    .add("./assets/images/stop_btn.png")
    .add("./assets/images/bg_landscape.png")
    .add("./assets/images/logo.png")
    .load(onAssetsLoaded);
function onAssetsLoaded(): void {
    slotTextures = [
        Texture.from("./assets/images/01.png"),
        Texture.from("./assets/images/02.png"),
        Texture.from("./assets/images/03.png"),
        Texture.from("./assets/images/04.png"),
        Texture.from("./assets/images/05.png"),
        Texture.from("./assets/images/06.png"),
        Texture.from("./assets/images/07.png"),
        Texture.from("./assets/images/08.png"),
        Texture.from("./assets/images/09.png"),
        Texture.from("./assets/images/10.png"),
        Texture.from("./assets/images/11.png"),
    ];
    spinBtnArrow = [
        Texture.from("./assets/images/spin_btn.png"),
        Texture.from("./assets/images/stop_btn.png"),
        Texture.from("./assets/images/stop_btn.png"),
    ];
    const back: Graphics = new Graphics();
    back.beginFill(0, 1);
    back.drawRect(0, 0, 1280, 720);
    const backTexture = new (Texture as any).from("./assets/images/bg_landscape.png");
    const backSprite = new Sprite(backTexture);
    backSprite.width = 1280;
    backSprite.height = 720;
    backSprite.x = 0;
    backSprite.y = 0;
    back.addChild(backSprite);
    app.stage.addChild(back);

    const px_mask_outter_bounds = new Graphics();
    px_mask_outter_bounds.drawRect(0, 0, 1000, 450);
    px_mask_outter_bounds.renderable = true;
    px_mask_outter_bounds.cacheAsBitmap = true;
    const reelContainer: Container = new Container();
    reelContainer.addChild(px_mask_outter_bounds);
    reelContainer.mask = px_mask_outter_bounds;
    reelContainer.y = 120;
    reelContainer.x = 250;
    for (let i = 0; i < 5; i++) {
        const rel: Container = createReel();
        rel.x = i * 160;
        const roll: Sprite[] = [];
        for (let j = 0; j < 4; j++) {
            const slot: Sprite = createSlot(j);
            rel.addChild(slot);
            roll.push(slot);
        }
        slots.push(roll);
        reelContainer.addChild(rel);
    }
    app.stage.addChild(reelContainer);
    const spin: Graphics = createSpin(reelContainer);
    app.stage.addChild(spin);
    const logo: Graphics = createLogo();
    app.stage.addChild(logo);
    spin.addListener("click", () => {
        if (!extraStop && play[play.length - 1] === false) {
            stoper.forEach((item: boolean, index: number) => (stoper[index] = true));
            play.forEach((item: boolean, index: number) => (play[index] = true));
            changeBtn();
            createSetTimeout();
            extraStop = true;
            return;
        }
        timeId.forEach((id: any, index) => {
            clearTimeout(timeId[index]);
        });
        stoper.forEach((item: boolean, index: number) => {
            stoper[index] = false;
            extraStop = false;
        });
    });
}
function changeBtn(): void {
    if (play[play.length - 1]) {
        spinPictureSprite.texture = spinBtnArrow[1];
    } else {
        spinPictureSprite.texture = spinBtnArrow[0];
    }
}
function createSetTimeout(): void {
    for (let i = 0; i < slots.length; i++) {
        const id: any = setTimeout(() => {
            if (extraStop) {
                stoper[i] = false;
                if (i === 4) {
                    extraStop = false;
                }
            }
        }, 3010 + i * 500);
        timeId.push(id);
    }
}
function createReel(i = 0): Container {
    const rc: Container = new Container();
    rc.x = i * 160;
    return rc;
}
function createSpin(reelContainer: Container): Graphics {
    const right: Graphics = new Graphics();
    right.beginFill(0, 0);
    right.drawRect(1120, 300, 150, 150);
    const spinPicture = new (Texture as any).from("./assets/images/spin_btn.png");
    spinPictureSprite = new Sprite(spinPicture);
    spinPictureSprite.width = 150;
    spinPictureSprite.height = 150;
    spinPictureSprite.x = 1120;
    spinPictureSprite.y = 300;
    right.addChild(spinPictureSprite);
    right.interactive = true;
    right.buttonMode = true;
    return right;
}
function createSlot(j: number): Sprite {
    const symbol: Sprite = new Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
    symbol.y = j * 150 - 150;
    symbol.width = 160;
    symbol.height = 150;
    symbol.x = Math.round((150 - symbol.width) / 2);
    return symbol;
}
function createLogo(): Graphics {
    const top = new Graphics();
    top.beginFill(0, 0);
    top.drawRect(1280 / 2 - 200, 5, 400, 70);
    const logoPicture = new (Texture as any).from("./assets/images/logo.png");
    const logoPictureSprite = new Sprite(logoPicture);
    logoPictureSprite.width = 400;
    logoPictureSprite.height = 70;
    logoPictureSprite.x = 1280 / 2 - 200;
    logoPictureSprite.y = 5;
    top.addChild(logoPictureSprite);
    return top;
}
app.ticker.add((): void => {
    slots.forEach((rol: Sprite[], indexRol: number) => {
        rol.forEach((slot: Sprite, indexSlot: number) => {
            if ((slot.y === 0 || slot.y % 150 === 0) && !stoper[indexRol]) {
                play[indexRol] = false;
                changeBtn();
            }
            if (play[indexRol]) {
                if (!stoper[indexRol]) {
                    slot.y += 3;
                } else {
                    slot.y += 30;
                }
                if (slot.y === 450) {
                    slot.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    slot.width = 160;
                    slot.height = 150;
                    slot.y = -150;
                }
            }
        });
    });
});
