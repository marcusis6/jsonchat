import { BaseModel } from "./BaseModel";

class User extends BaseModel {
  username: string;
  password: string;
  active: boolean;
  lang_pref: string;
  isAdmin: boolean;
  createdDate: Date;
  isSuperAdmin: boolean; 

  constructor(json: any = {}) {
    super(json);
    this.username = json.username || "";
    this.password = json.password || "";
    this.active = json.active ?? false;
    this.lang_pref = json.lang_pref || "en";
    this.isAdmin = json.isAdmin || false;
    this.isSuperAdmin = json.isSuperAdmin || false;

    // Initialize createdDate from server (current date and time)
    this.createdDate = new Date();
  }
}

export { User };
