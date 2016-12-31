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
            "03": "|",
            "04": "_",
            "05": "_|",
            "06": "|_",
            "07": "|-",
            "08": "-|",
            "09": "circle",
            "10": "circle",
            "20": "cross",
            "30": "up",
            "40": "down",
            "50": "|__|",
            "60": "abs |__|"
        },
        "diff": {
            "minRadius": 36,
            "maxRadius": 248,
            "boundary": 50
        }
    }
}
