import { BaseModel } from "./BaseModel";

class Message extends BaseModel {
  text: string;

  constructor(json: any = {}) {
    super(json);
    this.text = json.notice || "";
  }
}

export { Message };
