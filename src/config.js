export default {
    "webConfig": {
        "listDOMSelector": ".grid-container",
        "itemSelectors": [".grid-container > .grid-item", ".grid-container .blank-row .grid-item"],
        "itemImgSelector": ".grid-panel > .img-box > .img-a",
        "itemTitleSelector": ".grid-panel > .info-cont > .title-row > .product-title",
    },
    "inputType": {
        "0": "can't be matched",
        "1": "item of next",
        "2": "matched"
    },
    "noteConfig": {
        "noteType": {
            "01": "/",
            "02": "\\",
            "03": "1",
            "04": "circle item access",
            "10": "circle not confirmed",
            "11": "small circle",
            "12": "big circle",
            "20": "cross not confirmed",
            "21": "small cross",
            "22": "big cross",
            "31": "up",
            "41": "down"
        },
        "diff": {
            "minRadius": 36,
            "maxRadius": 248,
            "boundary": 50
        }
    }
}
