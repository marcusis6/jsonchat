import { BaseModel } from "./BaseModel";

class Message extends BaseModel {
  text: string;
  username: string;
  sender: string;

  constructor(json: any = {}) {
    super(json);
    this.text = json.text || "";
    this.username = json.username || "";
    this.sender = json.sender || "";
  }
}

export { Message };
