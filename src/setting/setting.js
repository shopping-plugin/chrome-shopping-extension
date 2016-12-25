export default {
    "key-search": {
        "identification": "#spulist-grid",
        "webConfig": {
            "listDOMSelector": ".m-grid",
            "itemSelectors": [".grid-container > .grid-item", ".grid-container .blank-row .grid-item"],
            "itemImgSelector": ".grid-panel > .img-box > .img-a",
            "itemTitleSelector": ".grid-panel > .info-cont > .title-row > .product-title"
        }
    },
    "fuzzy-search":
    {
        "identification": "#mainsrp-itemlist",
        "webConfig": {
            "listDOMSelector": ".m-itemlist",
            "itemSelectors": [".m-itemlist .items > .item", ".m-itemlist .items > .grid > .item"],
            "itemImgSelector": ".pic-box > .pic-box-inner > .pic > .pic-link",
            "itemTitleSelector": ".ctx-box > .title > a"
        }
    }
};
