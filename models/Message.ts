import { BaseModel } from "./BaseModel";

class Message extends BaseModel {
  text: string;
  username: string;
  sender: string;
  time: string;
  replyTo: ReplyTo;

  constructor(json: any = {}) {
    super(json);
    this.text = json.text || "";
    this.username = json.username || "";
    this.sender = json.sender || "";
    this.time = json.time || "";
    this.replyTo = new ReplyTo(json.replyTo) || "";
  }
}

class ReplyTo {
  username: string;
  text: string;
  constructor(json: any = {}) {
    this.text = json.text || "";
    this.username = json.username || "";
  }
}

export { Message };
