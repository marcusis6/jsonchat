import { BaseModel } from "./BaseModel";

class Setting extends BaseModel {
  notice: string;
  chatState: boolean;

  constructor(json: any = {}) {
    super(json);
    this.notice = json.notice || "";
    this.chatState = json.chatState || true; // by default  chat should be enabled
  }
}

export { Setting };
