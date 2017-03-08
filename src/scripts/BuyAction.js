import cloudService from "./cloudService"

export default class DomOperation {
  constructor() {
    this.cloudService = new cloudService();
  }

  /*
   * 处理不同页面的结算事件，将商品ID列表传给server记录
   * TODO: 目前仅监测淘宝和天猫商品详情页面的‘立即购买’和‘加入购物车’点击事件
   */
  handleBuyAction(p_id) {
    let id_list = [];
    id_list.push(p_id);
    console.debug(id_list);
    // TODO 调用后端方法传入id list
  }
}
