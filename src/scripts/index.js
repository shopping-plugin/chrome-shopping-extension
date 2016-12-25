
import Recognize from "./Recognize";
import setting from "../setting/setting";
import DOMOperation from "./DomOperation";


const state = {
    "webType": null
}

let recognizeInstance = null;

$(document).keydown((event) => {
    console.log(event.keyCode);
    if (recognizeInstance)
    {
        if (event.shiftKey && event.ctrlKey && event.keyCode === 77)
        {
            recognizeInstance.domDetach();
        }

        if (event.shiftKey && event.ctrlKey && event.keyCode === 78)
        {
            recognizeInstance.domAttach();
        }
    }
});

$(document).ready(function() {
    setTimeout(() => {
        let webConfig = null;
        for( let key in setting )
        {
            const dom = $( setting[key].identification );
            console.log("dom", dom);
            if (dom && dom.length === 1) {
                // dom 存在
                state.webType = key;
                webConfig = setting[key].webConfig;
                break;
            }
        }

        if (!state.webType)
        {
            console.log("this webpage is not  a matched target webpage. ");
        }
        else
        {
            recognizeInstance = new Recognize({
                webConfig,
                state
            });
        }
    }, 300);
});
